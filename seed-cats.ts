import { PrismaClient } from "./app/generated/prisma/index.js";

const prisma = new PrismaClient();

async function run() {
  const categories = ["Classic", "French", "Glam", "Bold", "Art"];
  for (const c of categories) {
    const existing = await prisma.category.findUnique({ where: { name: c } });
    if (!existing) {
      await prisma.category.create({ data: { name: c } });
    }
  }

  const lengths = ["Short", "Medium", "Long"];
  for (const l of lengths) {
    const existing = await prisma.style.findUnique({ where: { name: l } });
    if (!existing) {
      await prisma.style.create({ data: { name: l } });
    }
  }
}

run().catch(console.error).finally(() => prisma.$disconnect());
