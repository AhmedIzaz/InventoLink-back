-- CreateTable
CREATE TABLE "user_permitted_business_unit" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "account_id" INTEGER NOT NULL,
    "business_unit_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "user_permitted_business_unit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_permitted_business_unit" ADD CONSTRAINT "user_permitted_business_unit_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permitted_business_unit" ADD CONSTRAINT "user_permitted_business_unit_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "master_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permitted_business_unit" ADD CONSTRAINT "user_permitted_business_unit_business_unit_id_fkey" FOREIGN KEY ("business_unit_id") REFERENCES "master_business_unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
