-- AlterTable
ALTER TABLE "master_item_category" ADD COLUMN     "account_id" INTEGER;

-- CreateTable
CREATE TABLE "master_account" (
    "id" SERIAL NOT NULL,
    "account_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "master_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_business_unit" (
    "id" SERIAL NOT NULL,
    "business_unit_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "account_id" INTEGER,

    CONSTRAINT "master_business_unit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "master_business_unit" ADD CONSTRAINT "master_business_unit_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "master_account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master_item_category" ADD CONSTRAINT "master_item_category_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "master_account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
