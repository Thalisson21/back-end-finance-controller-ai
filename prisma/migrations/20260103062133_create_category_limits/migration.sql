/*
  Warnings:

  - You are about to drop the column `limit` on the `CategoryLimit` table. All the data in the column will be lost.
  - Added the required column `amount` to the `CategoryLimit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CategoryLimit" DROP COLUMN "limit",
ADD COLUMN     "amount" DECIMAL(65,30) NOT NULL;
