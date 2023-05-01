-- DropForeignKey
ALTER TABLE "menu_table" DROP CONSTRAINT "menu_table_account_id_fkey";

-- AlterTable
ALTER TABLE "menu_table" ALTER COLUMN "account_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "menu_table" ADD CONSTRAINT "menu_table_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "master_account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
