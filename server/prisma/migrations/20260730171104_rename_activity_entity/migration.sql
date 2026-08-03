/*
  Warnings:

  - You are about to drop the column `entity` on the `Activity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Activity" DROP COLUMN "entity",
ADD COLUMN     "entityType" TEXT;
