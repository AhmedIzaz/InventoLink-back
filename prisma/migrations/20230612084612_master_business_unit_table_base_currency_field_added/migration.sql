-- AlterTable
ALTER TABLE "master_business_unit" ADD COLUMN     "base_currency_id" INTEGER;

-- AddForeignKey
ALTER TABLE "master_business_unit" ADD CONSTRAINT "master_business_unit_base_currency_id_fkey" FOREIGN KEY ("base_currency_id") REFERENCES "master_currency"("id") ON DELETE SET NULL ON UPDATE CASCADE;
