/*
  Warnings:

  - You are about to drop the column `business_unit_id` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_business_unit_id_fkey";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "business_unit_id";
