/*
  Warnings:

  - You are about to drop the `OauthAccount` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OauthAccount" DROP CONSTRAINT "OauthAccount_userId_fkey";

-- DropTable
DROP TABLE "OauthAccount";

-- CreateTable
CREATE TABLE "Oauth_account" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "provider_id" TEXT NOT NULL,
    "provider_user_id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Oauth_account_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Oauth_account" ADD CONSTRAINT "Oauth_account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
