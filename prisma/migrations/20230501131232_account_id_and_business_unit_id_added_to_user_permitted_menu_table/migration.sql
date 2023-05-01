/*
  Warnings:

  - Added the required column `account_id` to the `user_permitted_menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `business_unit_id` to the `user_permitted_menu` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_permitted_menu" ADD COLUMN     "account_id" INTEGER NOT NULL,
ADD COLUMN     "business_unit_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "user_permitted_menu" ADD CONSTRAINT "user_permitted_menu_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "master_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permitted_menu" ADD CONSTRAINT "user_permitted_menu_business_unit_id_fkey" FOREIGN KEY ("business_unit_id") REFERENCES "master_business_unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
