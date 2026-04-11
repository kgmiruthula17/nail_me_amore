-- CreateEnum
CREATE TYPE "NailSize" AS ENUM ('S', 'M', 'L');

-- CreateEnum
CREATE TYPE "NailShape" AS ENUM ('SHORT_ALMOND', 'MEDIUM_ALMOND', 'LONG_ALMOND', 'COFFIN', 'XXXL_COFFIN');

-- AlterEnum: Add new values in their own transaction
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'PENDING';
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'CANCELLED';

-- Force commit so new enum values are visible
COMMIT;
BEGIN;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "amount",
DROP COLUMN "productName",
ADD COLUMN     "address" TEXT NOT NULL DEFAULT 'Chennai',
ADD COLUMN     "customerName" TEXT NOT NULL DEFAULT 'Customer',
ADD COLUMN     "email" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "phone" TEXT NOT NULL DEFAULT '0000000000',
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "imageUrl" TEXT,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomOrder" (
    "id" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL DEFAULT '',
    "address" TEXT,
    "inspoImage" TEXT NOT NULL,
    "nailSize" "NailSize" NOT NULL,
    "nailShape" "NailShape" NOT NULL,
    "total" DOUBLE PRECISION NOT NULL DEFAULT 45.00,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomOrder_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;