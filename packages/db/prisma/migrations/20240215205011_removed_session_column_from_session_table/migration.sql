/*
  Warnings:

  - You are about to drop the column `session` on the `Session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "session",
ALTER COLUMN "expiresAt" DROP NOT NULL;
