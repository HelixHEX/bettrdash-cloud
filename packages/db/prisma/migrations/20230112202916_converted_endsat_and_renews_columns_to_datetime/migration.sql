/*
  Warnings:

  - The `ends_at` column on the `Subscription` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `renews_at` column on the `Subscription` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "ends_at",
ADD COLUMN     "ends_at" TIMESTAMP(3),
DROP COLUMN "renews_at",
ADD COLUMN     "renews_at" TIMESTAMP(3);
