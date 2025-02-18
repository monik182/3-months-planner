/*
  Warnings:

  - You are about to drop the column `starting_value` on the `indicators` table. All the data in the column will be lost.
  - Added the required column `initial_value` to the `indicators` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "goals" ALTER COLUMN "status" SET DEFAULT '1';

-- AlterTable
ALTER TABLE "indicators" DROP COLUMN "starting_value",
ADD COLUMN     "initial_value" INTEGER NOT NULL,
ALTER COLUMN "status" SET DEFAULT '1';

-- AlterTable
ALTER TABLE "strategies" ALTER COLUMN "status" SET DEFAULT '1';
