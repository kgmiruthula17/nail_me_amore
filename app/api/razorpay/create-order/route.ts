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

    // 2. Create a pending order in our DB
    const dbOrder = await prisma.order.create({
      data: {
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
