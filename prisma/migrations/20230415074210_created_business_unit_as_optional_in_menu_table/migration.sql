-- DropForeignKey
ALTER TABLE "menu_table" DROP CONSTRAINT "menu_table_business_unit_id_fkey";

-- AlterTable
ALTER TABLE "menu_table" ALTER COLUMN "business_unit_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "menu_table" ADD CONSTRAINT "menu_table_business_unit_id_fkey" FOREIGN KEY ("business_unit_id") REFERENCES "master_business_unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
