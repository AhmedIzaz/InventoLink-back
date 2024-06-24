-- AlterTable
ALTER TABLE "category" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(200);

-- AlterTable
ALTER TABLE "inventory_transaction" ALTER COLUMN "type" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "product_name" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "product" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(200);

-- AlterTable
ALTER TABLE "purchase_order_header" ALTER COLUMN "description" SET DATA TYPE VARCHAR(200),
ALTER COLUMN "approval_status" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "purchase_order_row" ALTER COLUMN "product_name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(200);

-- AlterTable
ALTER TABLE "sales_order_header" ALTER COLUMN "description" SET DATA TYPE VARCHAR(200),
ALTER COLUMN "approval_status" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "customer_name" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "sales_order_row" ALTER COLUMN "description" SET DATA TYPE VARCHAR(200);

-- AlterTable
ALTER TABLE "supplier" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "contact" SET DATA TYPE VARCHAR(200);

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "username" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "contact" SET DATA TYPE VARCHAR(200);

-- AlterTable
ALTER TABLE "user_type" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100);