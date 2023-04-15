-- AlterTable
ALTER TABLE "master_account" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "master_business_unit" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "menu_table" ALTER COLUMN "is_active" SET DEFAULT true;

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" TEXT NOT NULL,
    "account_id" INTEGER NOT NULL,
    "business_unit_id" INTEGER,
    "user_type_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee" (
    "id" SERIAL NOT NULL,
    "employee_name" TEXT NOT NULL,
    "employee_code" TEXT NOT NULL,
    "mobile_number" TEXT,
    "personal_email" TEXT,
    "official_email" TEXT,
    "profile_picture_id" INTEGER,
    "bio" TEXT,
    "address" TEXT,
    "account_id" INTEGER NOT NULL,
    "business_unit_id" INTEGER,
    "user_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employee_user_id_key" ON "employee"("user_id");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "master_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_business_unit_id_fkey" FOREIGN KEY ("business_unit_id") REFERENCES "master_business_unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "master_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_business_unit_id_fkey" FOREIGN KEY ("business_unit_id") REFERENCES "master_business_unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
