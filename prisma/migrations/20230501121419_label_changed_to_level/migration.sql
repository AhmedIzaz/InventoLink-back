/*
  Warnings:

  - You are about to drop the column `is_first_label` on the `menu_table` table. All the data in the column will be lost.
  - You are about to drop the column `is_second_label` on the `menu_table` table. All the data in the column will be lost.
  - You are about to drop the column `is_third_label` on the `menu_table` table. All the data in the column will be lost.
  - Added the required column `is_first_level` to the `menu_table` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_second_level` to the `menu_table` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_third_level` to the `menu_table` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "menu_table" DROP COLUMN "is_first_label",
DROP COLUMN "is_second_label",
DROP COLUMN "is_third_label",
ADD COLUMN     "is_first_level" BOOLEAN NOT NULL,
ADD COLUMN     "is_second_level" BOOLEAN NOT NULL,
ADD COLUMN     "is_third_level" BOOLEAN NOT NULL;
