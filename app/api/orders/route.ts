import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, phone, email, address, total, items } = body;

    // Basic validation
    if (!customerName || !phone || !address || !items || !items.length) {
      return NextResponse.json(
        { error: "Missing required order fields" },
        { status: 400 }
      );
    }

    // Generate human-readable order number: NMA-YYYYMMDD-XXX
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
    const prefix = `NMA-${dateStr}-`;

    const lastOrder = await prisma.order.findFirst({
      where: { orderNumber: { startsWith: prefix } },
      orderBy: { orderNumber: "desc" },
      select: { orderNumber: true },
    });

    let nextSeq = 1;
    if (lastOrder?.orderNumber) {
      const lastSeq = parseInt(lastOrder.orderNumber.split("-").pop() || "0", 10);
      nextSeq = lastSeq + 1;
    }

    let newOrder;
    for (let attempt = 0; attempt < 5; attempt++) {
      const orderNumber = `${prefix}${String(nextSeq + attempt).padStart(3, "0")}`;
      try {
        newOrder = await prisma.order.create({
          data: {
            orderNumber,
            customerName,
            phone,
            email: email || "",
            address,
            total: Number(total),
            status: "PENDING",
            items: {
              create: items.map((item: any) => ({
                productId: item.productId,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                imageUrl: item.imageUrl,
                shape: item.shape,
                size: item.size,
              })),
            },
          },
        });
        break;
      } catch (err: any) {
        if (err.code === "P2002" && attempt < 4) continue;
        throw err;
      }
    }

    if (!newOrder) throw new Error("Failed to create order after retries");

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
