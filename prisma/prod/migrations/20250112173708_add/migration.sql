/*
  Warnings:

  - Added the required column `sequence` to the `goal_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sequence` to the `indicator_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sequence` to the `strategy_history` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "goal_history" ADD COLUMN     "sequence" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "indicator_history" ADD COLUMN     "sequence" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "strategy_history" ADD COLUMN     "sequence" INTEGER NOT NULL;
