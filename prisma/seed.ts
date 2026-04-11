import { PrismaClient } from "../app/generated/prisma";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Seed Products from data/products.json
  const productsPath = path.join(process.cwd(), "data", "products.json");
  const productsRaw = fs.readFileSync(productsPath, "utf-8");
  const products = JSON.parse(productsRaw);

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {},
      create: {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice ?? null,
        category: product.category,
        style: product.style,
        description: product.description,
        image: product.image ?? null,
      },
    });
    console.log(`  ✅ Product: ${product.name}`);
  }

  // Reset the auto-increment sequence to be after the max id
  const maxId = Math.max(...products.map((p: any) => p.id));
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"Product"', 'id'), ${maxId});`
  );
  console.log(`  🔢 Auto-increment sequence set to ${maxId}`);

  // Seed Orders from data/stats.json
  const statsPath = path.join(process.cwd(), "data", "stats.json");
  const statsRaw = fs.readFileSync(statsPath, "utf-8");
  const stats = JSON.parse(statsRaw);

  if (stats.recentOrders) {
    for (const order of stats.recentOrders) {
      const statusMap: Record<string, "PROCESSING" | "SHIPPED" | "DELIVERED"> = {
        Processing: "PROCESSING",
        Shipped: "SHIPPED",
        Delivered: "DELIVERED",
      };

      await prisma.order.create({
  data: {
    id: order.id,
    customerName: order.customerName || "Test User",
    address: order.address || "Chennai",
    phone: order.phone || "9999999999",
    total: order.amount, 
    status: statusMap[order.status] || "PROCESSING",
    createdAt: new Date(order.date),
    items: {
      create: [
        {
          productId: 1,
          name: order.product,
          quantity: 1,
          price: order.amount
        }
      ]
    }
  },
});
      console.log(`  ✅ Order: ${order.id} — ${order.product}`);
    }
  }

  console.log("\n🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
