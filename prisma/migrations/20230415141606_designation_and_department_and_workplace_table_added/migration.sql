-- AlterTable
ALTER TABLE "employee" ADD COLUMN     "department_id" INTEGER,
ADD COLUMN     "designation_id" INTEGER,
ADD COLUMN     "workplace_id" INTEGER;

-- CreateTable
CREATE TABLE "workplace" (
    "id" SERIAL NOT NULL,
    "workplace_name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "address" TEXT,
    "account_id" INTEGER NOT NULL,
    "business_unit_id" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "workplace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department" (
    "id" SERIAL NOT NULL,
    "department_name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "account_id" INTEGER NOT NULL,
    "business_unit_id" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "designation" (
    "id" SERIAL NOT NULL,
    "designation_name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "account_id" INTEGER NOT NULL,
    "business_unit_id" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "designation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_table" (
    "id" SERIAL NOT NULL,
    "type_id" INTEGER NOT NULL,
    "file_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "file_table_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "workplace" ADD CONSTRAINT "workplace_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "master_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workplace" ADD CONSTRAINT "workplace_business_unit_id_fkey" FOREIGN KEY ("business_unit_id") REFERENCES "master_business_unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "master_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_business_unit_id_fkey" FOREIGN KEY ("business_unit_id") REFERENCES "master_business_unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "designation" ADD CONSTRAINT "designation_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "master_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "designation" ADD CONSTRAINT "designation_business_unit_id_fkey" FOREIGN KEY ("business_unit_id") REFERENCES "master_business_unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_workplace_id_fkey" FOREIGN KEY ("workplace_id") REFERENCES "workplace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_designation_id_fkey" FOREIGN KEY ("designation_id") REFERENCES "designation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
