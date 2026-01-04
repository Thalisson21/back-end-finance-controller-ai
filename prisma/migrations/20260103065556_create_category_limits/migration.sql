/*
  Warnings:

  - You are about to drop the column `createdAt` on the `CategoryLimit` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `CategoryLimit` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,categoryId,month,year]` on the table `CategoryLimit` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `month` to the `CategoryLimit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `CategoryLimit` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "CategoryLimit_categoryId_userId_key";

-- AlterTable
ALTER TABLE "CategoryLimit" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "month" INTEGER NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CategoryLimit_userId_categoryId_month_year_key" ON "CategoryLimit"("userId", "categoryId", "month", "year");
