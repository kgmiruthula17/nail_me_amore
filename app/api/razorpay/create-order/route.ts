import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";

function getRazorpay() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
}

export async function POST(request: Request) {
  try {
    const razorpay = getRazorpay();
    const body = await request.json();
    const { customerName, phone, email, address, total, items } = body;

    // Basic validation
    if (!customerName || !phone || !address || !items?.length || !total) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Amount in paise (Razorpay expects the smallest currency unit)
    const amountInPaise = Math.round(total * 100);

    if (amountInPaise < 100) {
      return NextResponse.json(
        { error: "Amount must be at least ₹1 (100 paise)" },
        { status: 400 }
      );
    }

    // 1. Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        customerName,
        phone,
        email: email || "",
      },
    });

    // Generate human-readable order number: NMA-YYYYMMDD-XXX
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, ""); // e.g. 20260616
    const prefix = `NMA-${dateStr}-`;

    // Find the highest existing order number for today
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

    // Retry loop in case of concurrent inserts
    let dbOrder;
    for (let attempt = 0; attempt < 5; attempt++) {
      const orderNumber = `${prefix}${String(nextSeq + attempt).padStart(3, "0")}`;
      try {
        dbOrder = await prisma.order.create({
          data: {
            orderNumber,
            customerName,
            phone,
            email: email || "",
            address,
            total: Number(total),
            status: "PENDING",
            paymentStatus: "PENDING",
            razorpayOrderId: razorpayOrder.id,
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
        break; // success
      } catch (err: any) {
        if (err.code === "P2002" && attempt < 4) continue; // unique conflict, retry
        throw err;
      }
    }

    if (!dbOrder) throw new Error("Failed to create order after retries");

    // 3. Return both IDs to the frontend
    return NextResponse.json({
      razorpayOrderId: razorpayOrder.id,
      dbOrderId: dbOrder.id,
      amount: amountInPaise,
      currency: "INR",
    });
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
