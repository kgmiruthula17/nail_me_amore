import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { uploadToCloudinary } from "../../../lib/cloudinary";

export const dynamic = "force-dynamic";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const productId = parseInt(id);

    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
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

    const contentType = request.headers.get("content-type") || "";

    let updateData: any = {};

    if (contentType.includes("multipart/form-data")) {
      // Handle FormData (when images are being uploaded)
      const formData = await request.formData();

      const name = formData.get("name") as string;
      const price = formData.get("price");
      const originalPrice = formData.get("originalPrice");
      const category = formData.get("category") as string;
      const style = formData.get("style") as string;

      updateData = {
        name,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        category,
        style,
      };

      // Handle cover image upload
      const coverImage = formData.get("image") as File | null;
      if (coverImage && coverImage.name && coverImage.size > 0) {
        const bytes = await coverImage.arrayBuffer();
        const buffer = Buffer.from(bytes);
        updateData.image = await uploadToCloudinary(buffer, coverImage.name);
      }

      // Handle extra images
      // existingExtraImages contains URLs of previously uploaded images that should be kept
      const existingExtraImagesRaw = formData.get("existingExtraImages") as string | null;
      const existingExtraImages: string[] = existingExtraImagesRaw 
        ? JSON.parse(existingExtraImagesRaw) 
        : [];

      // Upload new extra images
      const newExtraFiles = formData.getAll("extraImages") as File[];
      const newExtraUrls: string[] = [];

      for (const file of newExtraFiles) {
        if (file && file.name && file.size > 0) {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const url = await uploadToCloudinary(buffer, file.name);
          newExtraUrls.push(url);
        }
      }

      updateData.extraImages = [...existingExtraImages, ...newExtraUrls];
    } else {
      // Handle JSON body (simple field updates)
      updateData = await request.json();
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    console.error("Error updating product:", error);
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}
