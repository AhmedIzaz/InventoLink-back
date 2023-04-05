-- CreateTable
CREATE TABLE "master_item_category" (
    "id" SERIAL NOT NULL,
    "category_name" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "master_item_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_item" (
    "id" SERIAL NOT NULL,
    "itemName" VARCHAR(100) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "master_item_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "master_item" ADD CONSTRAINT "master_item_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "master_item_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
