/*
  Warnings:

  - A unique constraint covering the columns `[provider_user_id]` on the table `Oauth_account` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Oauth_account_provider_user_id_key" ON "Oauth_account"("provider_user_id");
