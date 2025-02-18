/*
  Warnings:

  - Made the column `vision` on table `plans` required. This step will fail if there are existing NULL values in that column.
  - Made the column `milestone` on table `plans` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "plans" ALTER COLUMN "vision" SET NOT NULL,
ALTER COLUMN "vision" SET DEFAULT '',
ALTER COLUMN "milestone" SET NOT NULL,
ALTER COLUMN "milestone" SET DEFAULT '';
