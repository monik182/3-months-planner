/*
  Warnings:

  - You are about to alter the column `value` on the `indicator_history` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `starting_value` on the `indicators` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `goal_value` on the `indicators` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "indicator_history" ALTER COLUMN "value" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "indicators" ALTER COLUMN "starting_value" SET DATA TYPE INTEGER,
ALTER COLUMN "goal_value" SET DATA TYPE INTEGER;
