import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { uploadToCloudinary } from "../../lib/cloudinary";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Extract text fields
    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const originalPrice = formData.get("originalPrice") ? Number(formData.get("originalPrice")) : null;
    const category = formData.get("category") as string;
    const style = formData.get("style") as string;

    // Extract and upload image to Cloudinary
    const image = formData.get("image") as File | null;
    let imageUrl: string | null = null;

    if (image && image.name) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      imageUrl = await uploadToCloudinary(buffer, image.name);
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        price,
        originalPrice,
        category,
        style,
        description: "",
        image: imageUrl,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

