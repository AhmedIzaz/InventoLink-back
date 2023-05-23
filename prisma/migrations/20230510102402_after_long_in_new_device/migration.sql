-- CreateTable
CREATE TABLE "master_unit_of_measurement" (
    "id" SERIAL NOT NULL,
    "unit_of_measurement_name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "master_unit_of_measurement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_currency" (
    "id" SERIAL NOT NULL,
    "currency_name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "master_currency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_item_category" (
    "id" SERIAL NOT NULL,
    "item_category_name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "account_id" INTEGER,
    "business_unit_id" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "master_item_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_item" (
    "id" SERIAL NOT NULL,
    "item_name" VARCHAR(100) NOT NULL,
    "base_price" DOUBLE PRECISION NOT NULL,
    "base_price_currency_id" INTEGER,
    "description" TEXT,
    "account_id" INTEGER,
    "business_unit_id" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "category_id" INTEGER,
    "unit_of_measurement_id" INTEGER,

    CONSTRAINT "master_item_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "master_item_category" ADD CONSTRAINT "master_item_category_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "master_account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master_item_category" ADD CONSTRAINT "master_item_category_business_unit_id_fkey" FOREIGN KEY ("business_unit_id") REFERENCES "master_business_unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master_item" ADD CONSTRAINT "master_item_base_price_currency_id_fkey" FOREIGN KEY ("base_price_currency_id") REFERENCES "master_currency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master_item" ADD CONSTRAINT "master_item_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "master_account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master_item" ADD CONSTRAINT "master_item_business_unit_id_fkey" FOREIGN KEY ("business_unit_id") REFERENCES "master_business_unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master_item" ADD CONSTRAINT "master_item_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "master_item_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master_item" ADD CONSTRAINT "master_item_unit_of_measurement_id_fkey" FOREIGN KEY ("unit_of_measurement_id") REFERENCES "master_unit_of_measurement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
