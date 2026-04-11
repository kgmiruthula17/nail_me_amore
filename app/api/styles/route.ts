import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function GET() {
  try {
    const styles = await prisma.style.findMany({
      orderBy: { createdAt: 'asc' }
    });
    return NextResponse.json(styles);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch styles" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const style = await prisma.style.create({
      data: { name }
    });
    return NextResponse.json(style);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create style" }, { status: 500 });
  }
}
