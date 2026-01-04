/*
  Warnings:

  - You are about to drop the column `limit` on the `CategoryLimit` table. All the data in the column will be lost.
  - You are about to drop the column `month` on the `CategoryLimit` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `CategoryLimit` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[categoryId,userId]` on the table `CategoryLimit` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `CategoryLimit` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "CategoryLimit_userId_categoryId_month_year_key";

-- AlterTable
ALTER TABLE "CategoryLimit" DROP COLUMN "limit",
DROP COLUMN "month",
DROP COLUMN "year",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CategoryLimit_categoryId_userId_key" ON "CategoryLimit"("categoryId", "userId");
