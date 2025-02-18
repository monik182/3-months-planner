/*
  Warnings:

  - Added the required column `frequency` to the `strategies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "plans" ALTER COLUMN "vision" DROP NOT NULL,
ALTER COLUMN "milestone" DROP NOT NULL;

-- AlterTable
ALTER TABLE "strategies" ADD COLUMN     "frequency" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "strategy_history" ADD COLUMN     "frequencies" BOOLEAN[] DEFAULT ARRAY[]::BOOLEAN[];
