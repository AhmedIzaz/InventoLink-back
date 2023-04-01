-- CreateTable
CREATE TABLE "master_item" (
    "id" SERIAL NOT NULL,
    "itemName" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "master_item_id_key" ON "master_item"("id");
