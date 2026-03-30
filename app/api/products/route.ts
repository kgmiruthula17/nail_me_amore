import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { promises as fs } from "fs";
import path from "path";

import defaultProducts from "../../../data/products.json";

const productsFilePath = path.join(process.cwd(), "data", "products.json");

export async function GET() {
  try {
    const fileContents = await fs.readFile(productsFilePath, "utf8");
    const products = JSON.parse(fileContents);
    return NextResponse.json(products);
  } catch (error) {
    console.warn("Falling back to default products data:", error);
    return NextResponse.json(defaultProducts);
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Extract text fields
    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const originalPrice = formData.get("originalPrice") ? Number(formData.get("originalPrice")) : undefined;
    const category = formData.get("category") as string;
    const style = formData.get("style") as string;
    const description = formData.get("description") as string;
    
    // Extract Image
    const image = formData.get("image") as File | null;
    let imagePath = "";

    if (image && image.name) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Save image to public/images folder
      const filename = `${Date.now()}-${image.name.replace(/\s+/g, "_")}`;
      const uploadDir = path.join(process.cwd(), "public", "images");
      const filepath = path.join(uploadDir, filename);
      
      await fs.writeFile(filepath, buffer);
      imagePath = `/images/${filename}`;
    }

    // Read existing products to determine new ID and append
    const fileContents = await fs.readFile(productsFilePath, "utf8");
    const products = JSON.parse(fileContents);
    
    const newId = products.length > 0 ? Math.max(...products.map((p: any) => p.id)) + 1 : 1;
    
    const newProduct = {
      id: newId,
      name,
      price,
      originalPrice,
      category,
      style,
      description,
      image: imagePath || undefined,
    };

    products.push(newProduct);
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
