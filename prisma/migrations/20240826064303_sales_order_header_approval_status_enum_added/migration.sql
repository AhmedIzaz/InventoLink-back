/*
  Warnings:

  - Changed the type of `approval_status` on the `sales_order_header` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "sales_order_header" DROP COLUMN "approval_status",
ADD COLUMN     "approval_status" "ApprovalStatus" NOT NULL;
