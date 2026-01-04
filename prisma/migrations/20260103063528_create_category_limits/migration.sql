/*
  Warnings:

  - Added the required column `limit` to the `CategoryLimit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CategoryLimit" ADD COLUMN     "limit" DECIMAL(65,30) NOT NULL;
