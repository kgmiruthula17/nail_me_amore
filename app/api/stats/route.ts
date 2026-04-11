import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Compute stats from actual database records
    const totalBuys = await prisma.order.count();

    const incomeResult = await prisma.order.aggregate({
      _sum: { total: true },
    });
    const totalIncome = incomeResult._sum.total ?? 0;

    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });

    // Map orders to the response shape the frontend expects
    const mappedOrders = recentOrders.map((order) => ({
      id: order.id,
      product: order.items.length > 0 ? (order.items[0].name + (order.items.length > 1 ? ' + more...' : '')) : "Custom Order",
      amount: order.total,
      status: order.status.charAt(0) + order.status.slice(1).toLowerCase(), // DELIVERED -> Delivered
      date: order.createdAt.toISOString(),
    }));

    return NextResponse.json({
      totalBuys,
      totalIncome,
      activeSessions: 24, // Static — no session tracking infrastructure yet
      conversionRate: "3.8%", // Static — no analytics infrastructure yet
      recentOrders: mappedOrders,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

