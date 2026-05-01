import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "../../lib/prisma";
import { randomUUID } from "crypto";

const VISITOR_COOKIE = "visitor_id";
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

/**
 * GET /api/cart — Returns the visitor's saved cart from DB.
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const visitorId = cookieStore.get(VISITOR_COOKIE)?.value;

    if (!visitorId) {
      return NextResponse.json({ items: [] });
    }

    const cart = await prisma.visitorCart.findUnique({
      where: { visitorId },
      include: { items: true },
    });

    return NextResponse.json({ items: cart?.items || [] });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ items: [] });
  }
}

/**
 * POST /api/cart — Saves the visitor's cart to DB.
 * Expects body: { items: Array<{ productId, name, price, imageUrl, shape, size, quantity }> }
 */
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    let visitorId = cookieStore.get(VISITOR_COOKIE)?.value;

    // Create visitor cookie if not present
    if (!visitorId) {
      visitorId = randomUUID();
      cookieStore.set(VISITOR_COOKIE, visitorId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: COOKIE_MAX_AGE,
      });
    }

    const { items } = await request.json();

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "Items must be an array" },
        { status: 400 }
      );
    }

    // Upsert the cart
    if (items.length === 0) {
      // If cart is empty, delete it
      await prisma.visitorCart.deleteMany({
        where: { visitorId },
      });
      return NextResponse.json({ success: true });
    }

    // Upsert cart and replace all items
    await prisma.$transaction(async (tx) => {
      // Upsert the cart record
      const cart = await tx.visitorCart.upsert({
        where: { visitorId },
        update: { lastActive: new Date() },
        create: { visitorId },
      });

      // Delete existing items
      await tx.visitorCartItem.deleteMany({
        where: { cartId: cart.id },
      });

      // Create new items
      if (items.length > 0) {
        await tx.visitorCartItem.createMany({
          data: items.map((item: any) => ({
            cartId: cart.id,
            productId: item.productId || 0,
            name: item.name || "",
            price: item.price || 0,
            imageUrl: item.imageUrl || null,
            shape: item.shape || "",
            size: item.size || "",
            quantity: item.quantity || 1,
          })),
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving cart:", error);
    return NextResponse.json(
      { error: "Failed to save cart" },
      { status: 500 }
    );
  }
}
