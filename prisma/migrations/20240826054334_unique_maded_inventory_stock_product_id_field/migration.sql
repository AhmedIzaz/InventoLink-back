/*
  Warnings:

  - A unique constraint covering the columns `[product_id]` on the table `inventory_stock` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "inventory_stock_product_id_key" ON "inventory_stock"("product_id");
