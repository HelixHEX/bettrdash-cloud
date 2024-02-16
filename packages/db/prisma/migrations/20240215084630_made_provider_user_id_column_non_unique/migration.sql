/*
  Warnings:

  - Added the required column `provider_username` to the `Oauth_account` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Oauth_account_provider_user_id_key";

-- AlterTable
ALTER TABLE "Oauth_account" ADD COLUMN     "provider_username" TEXT NOT NULL;
