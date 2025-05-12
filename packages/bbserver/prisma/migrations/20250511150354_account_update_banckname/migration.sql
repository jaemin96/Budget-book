/*
  Warnings:

  - A unique constraint covering the columns `[bankName]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Account_bankName_key" ON "Account"("bankName");
