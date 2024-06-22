-- CreateTable
CREATE TABLE "chat_user" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" TEXT NOT NULL,
    "username" VARCHAR(250) NOT NULL,

    CONSTRAINT "chat_user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "chat_user_email_key" ON "chat_user"("email");
