/*
  Warnings:

  - Changed the type of `type` on the `inventory_transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "InventoryTransactionType" AS ENUM ('IN', 'OUT');

-- AlterTable
ALTER TABLE "inventory_transaction" DROP COLUMN "type",
ADD COLUMN     "type" "InventoryTransactionType" NOT NULL;
