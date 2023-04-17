-- CreateTable
CREATE TABLE "user_permitted_menu" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "menu_id" INTEGER NOT NULL,
    "is_create" BOOLEAN NOT NULL DEFAULT false,
    "is_edit" BOOLEAN NOT NULL DEFAULT false,
    "is_view" BOOLEAN NOT NULL DEFAULT false,
    "is_delete" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "user_permitted_menu_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_permitted_menu" ADD CONSTRAINT "user_permitted_menu_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permitted_menu" ADD CONSTRAINT "user_permitted_menu_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "menu_table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
