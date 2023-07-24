/*
  Warnings:

  - You are about to drop the column `description` on the `master_business_unit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "master_business_unit" DROP COLUMN "description",
ADD COLUMN     "address" TEXT;
