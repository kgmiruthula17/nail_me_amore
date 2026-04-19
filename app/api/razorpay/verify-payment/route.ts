import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      dbOrderId,
    } = body;

    // Validate required fields
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !dbOrderId
    ) {
      return NextResponse.json(
        { error: "Missing payment verification fields" },
        { status: 400 }
      );
    }

    // Verify the payment signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      // Signature mismatch — potential tampering
      await prisma.order.update({
        where: { id: dbOrderId },
        data: { paymentStatus: "FAILED" },
      });

      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    // Signature valid — mark order as paid
    const updatedOrder = await prisma.order.update({
      where: { id: dbOrderId },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        paymentStatus: "PAID",
        status: "PROCESSING",
      },
    });

    return NextResponse.json({
      success: true,
      orderId: updatedOrder.id,
    });
  } catch (error: any) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: error.message || "Payment verification failed" },
      { status: 500 }
    );
  }
}
