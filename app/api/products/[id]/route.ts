import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { promises as fs } from "fs";
import path from "path";

const productsFilePath = path.join(process.cwd(), "data", "products.json");

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const productId = parseInt(id);
    const fileContents = await fs.readFile(productsFilePath, "utf8");
    const products = JSON.parse(fileContents);

    const updatedProducts = products.filter((p: any) => p.id !== productId);
    
    // Check if product existed
    if (products.length === updatedProducts.length) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await fs.writeFile(productsFilePath, JSON.stringify(updatedProducts, null, 2));
    
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const productId = parseInt(id);
    const updates = await request.json();
    
    const fileContents = await fs.readFile(productsFilePath, "utf8");
    const products = JSON.parse(fileContents);
    
    const productIndex = products.findIndex((p: any) => p.id === productId);
    if (productIndex === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    products[productIndex] = { ...products[productIndex], ...updates };
    
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));

    return NextResponse.json(products[productIndex]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}
