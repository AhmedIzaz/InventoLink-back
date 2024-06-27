/*
  Warnings:

  - The `oauthProvider` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "EOauthProvider" AS ENUM ('GOOGLE', 'FACEBOOK', 'LINKEDIN');

-- AlterTable
ALTER TABLE "user" DROP COLUMN "oauthProvider",
ADD COLUMN     "oauthProvider" "EOauthProvider";
