-- AlterTable
ALTER TABLE "master_business_unit" ADD COLUMN     "created_by" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "master_business_unit" ADD CONSTRAINT "master_business_unit_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
