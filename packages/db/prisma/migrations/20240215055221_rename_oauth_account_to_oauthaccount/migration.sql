/*
  Warnings:

  - You are about to drop the `Oauth_Account` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Oauth_Account" DROP CONSTRAINT "Oauth_Account_userId_fkey";

-- DropTable
DROP TABLE "Oauth_Account";

-- CreateTable
CREATE TABLE "OauthAccount" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "provider_id" TEXT NOT NULL,
    "provider_user_id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "OauthAccount_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OauthAccount" ADD CONSTRAINT "OauthAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
