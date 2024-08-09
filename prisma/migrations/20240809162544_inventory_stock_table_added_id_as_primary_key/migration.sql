/*
  Warnings:

  - The primary key for the `inventory_stock` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "inventory_stock" DROP CONSTRAINT "inventory_stock_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "inventory_stock_pkey" PRIMARY KEY ("id");
