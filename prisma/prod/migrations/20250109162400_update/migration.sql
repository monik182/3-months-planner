/*
  Warnings:

  - Made the column `end_date` on table `plans` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "plans" ALTER COLUMN "end_date" SET NOT NULL;
