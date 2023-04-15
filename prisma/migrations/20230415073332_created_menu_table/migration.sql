/*
  Warnings:

  - You are about to drop the `employee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `master_item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `master_item_category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `account_id` on table `master_business_unit` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "employee" DROP CONSTRAINT "employee_account_id_fkey";

-- DropForeignKey
ALTER TABLE "employee" DROP CONSTRAINT "employee_user_id_fkey";

-- DropForeignKey
ALTER TABLE "master_business_unit" DROP CONSTRAINT "master_business_unit_account_id_fkey";

-- DropForeignKey
ALTER TABLE "master_item" DROP CONSTRAINT "master_item_category_id_fkey";

-- DropForeignKey
ALTER TABLE "master_item_category" DROP CONSTRAINT "master_item_category_account_id_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_account_id_fkey";

-- AlterTable
ALTER TABLE "master_account" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "master_business_unit" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "account_id" SET NOT NULL;

-- DropTable
DROP TABLE "employee";

-- DropTable
DROP TABLE "master_item";

-- DropTable
DROP TABLE "master_item_category";

-- DropTable
DROP TABLE "user";

-- CreateTable
CREATE TABLE "menu_table" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "label" VARCHAR(100) NOT NULL,
    "is_first_label" BOOLEAN NOT NULL,
    "is_second_label" BOOLEAN NOT NULL,
    "is_third_label" BOOLEAN NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "title" TEXT NOT NULL,
    "account_id" INTEGER NOT NULL,
    "business_unit_id" INTEGER NOT NULL,

    CONSTRAINT "menu_table_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "master_business_unit" ADD CONSTRAINT "master_business_unit_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "master_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_table" ADD CONSTRAINT "menu_table_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "master_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_table" ADD CONSTRAINT "menu_table_business_unit_id_fkey" FOREIGN KEY ("business_unit_id") REFERENCES "master_business_unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
