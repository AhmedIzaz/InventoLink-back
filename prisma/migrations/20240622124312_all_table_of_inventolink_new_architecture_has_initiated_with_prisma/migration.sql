/*
  Warnings:

  - You are about to drop the `chat_user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "chat_user";

-- CreateTable
CREATE TABLE "user_type" (
    "id" SERIAL NOT NULL,
    "name" CHAR(100) NOT NULL,

    CONSTRAINT "user_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "username" CHAR(100) NOT NULL,
    "email" CHAR(100) NOT NULL,
    "password" TEXT NOT NULL,
    "contact" CHAR(200) NOT NULL,
    "user_type_id" INTEGER NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier" (
    "id" SERIAL NOT NULL,
    "name" CHAR(100) NOT NULL,
    "email" CHAR(100) NOT NULL,
    "contact" CHAR(200) NOT NULL,

    CONSTRAINT "supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "name" CHAR(100) NOT NULL,
    "description" CHAR(200),

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" SERIAL NOT NULL,
    "name" CHAR(100) NOT NULL,
    "description" CHAR(200),
    "price" DOUBLE PRECISION NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_stock" (
    "product_id" INTEGER NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "inventory_stock_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "inventory_transaction" (
    "id" SERIAL NOT NULL,
    "type" CHAR(50) NOT NULL,
    "product_id" INTEGER NOT NULL,
    "product_name" CHAR(100) NOT NULL,
    "transaction_quantity" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "inventory_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_order_header" (
    "id" SERIAL NOT NULL,
    "description" CHAR(200),
    "approval_status" CHAR(50) NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    "created_by" INTEGER NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "purchase_order_header_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_order_row" (
    "id" SERIAL NOT NULL,
    "header_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "product_name" CHAR(100) NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,
    "description" CHAR(200),

    CONSTRAINT "purchase_order_row_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_order_header" (
    "id" SERIAL NOT NULL,
    "description" CHAR(200),
    "approval_status" CHAR(50) NOT NULL,
    "customer_name" CHAR(100) NOT NULL,
    "created_by" INTEGER NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "sales_order_header_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_order_row" (
    "id" SERIAL NOT NULL,
    "header_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,
    "description" CHAR(200),

    CONSTRAINT "sales_order_row_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_type_name_key" ON "user_type"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_password_key" ON "user"("password");

-- CreateIndex
CREATE UNIQUE INDEX "supplier_email_key" ON "supplier"("email");

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "product_name_key" ON "product"("name");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_user_type_id_fkey" FOREIGN KEY ("user_type_id") REFERENCES "user_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_stock" ADD CONSTRAINT "inventory_stock_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_transaction" ADD CONSTRAINT "inventory_transaction_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_header" ADD CONSTRAINT "purchase_order_header_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_header" ADD CONSTRAINT "purchase_order_header_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_row" ADD CONSTRAINT "purchase_order_row_header_id_fkey" FOREIGN KEY ("header_id") REFERENCES "purchase_order_header"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_row" ADD CONSTRAINT "purchase_order_row_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_order_header" ADD CONSTRAINT "sales_order_header_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_order_row" ADD CONSTRAINT "sales_order_row_header_id_fkey" FOREIGN KEY ("header_id") REFERENCES "sales_order_header"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_order_row" ADD CONSTRAINT "sales_order_row_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
