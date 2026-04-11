import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { name } = await req.json();
    
    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const style = await prisma.style.update({
      where: { id },
      data: { name },
    });
    return NextResponse.json(style);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update style" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await prisma.style.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete style" }, { status: 500 });
  }
}
