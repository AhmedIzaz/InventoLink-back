-- AlterTable
ALTER TABLE "user" ADD COLUMN     "isOauthUser" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "oauthProvider" TEXT;
