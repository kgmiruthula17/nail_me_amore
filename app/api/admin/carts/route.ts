import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { verifySession } from "../../../lib/auth";

/**
 * GET /api/admin/carts — Returns all visitor carts (auth-protected).
 * Query params: ?filter=24h|7d|all (default: all)
 */
export async function GET(request: Request) {
  if (!verifySession(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const filter = url.searchParams.get("filter") || "all";

    let whereClause: any = {};

    if (filter === "24h") {
      whereClause.lastActive = {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
      };
    } else if (filter === "7d") {
      whereClause.lastActive = {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      };
    }

    const carts = await prisma.visitorCart.findMany({
      where: whereClause,
      include: {
        items: true,
      },
      orderBy: { lastActive: "desc" },
    });

    // Map to include computed fields
    const mapped = carts.map((cart) => ({
      id: cart.id,
      visitorId: cart.visitorId,
      itemCount: cart.items.length,
      totalValue: cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      lastActive: cart.lastActive.toISOString(),
      createdAt: cart.createdAt.toISOString(),
      items: cart.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        shape: item.shape,
        size: item.size,
        quantity: item.quantity,
      })),
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("Error fetching carts:", error);
    return NextResponse.json(
      { error: "Failed to fetch carts" },
      { status: 500 }
    );
  }
}
