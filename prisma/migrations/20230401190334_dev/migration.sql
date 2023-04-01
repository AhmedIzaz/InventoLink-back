/*
  Warnings:

  - You are about to alter the column `itemName` on the `master_item` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - Added the required column `category_id` to the `master_item` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "master_item_id_key";

-- AlterTable
ALTER TABLE "master_item" ADD COLUMN     "category_id" INTEGER NOT NULL,
ALTER COLUMN "itemName" SET DATA TYPE VARCHAR(100),
ADD CONSTRAINT "master_item_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "master_item_category" (
    "id" SERIAL NOT NULL,
    "category_name" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "master_item_category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "master_item" ADD CONSTRAINT "master_item_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "master_item_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
