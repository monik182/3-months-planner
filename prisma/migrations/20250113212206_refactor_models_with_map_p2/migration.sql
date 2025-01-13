/*
  Warnings:

  - Made the column `plan_id` on table `goal_history` required. This step will fail if there are existing NULL values in that column.
  - Made the column `plan_id` on table `indicator_history` required. This step will fail if there are existing NULL values in that column.
  - Made the column `plan_id` on table `indicators` required. This step will fail if there are existing NULL values in that column.
  - Made the column `plan_id` on table `notifications` required. This step will fail if there are existing NULL values in that column.
  - Made the column `plan_id` on table `strategies` required. This step will fail if there are existing NULL values in that column.
  - Made the column `plan_id` on table `strategy_history` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "goal_history" ALTER COLUMN "plan_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "indicator_history" ALTER COLUMN "plan_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "indicators" ALTER COLUMN "plan_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "notifications" ALTER COLUMN "plan_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "strategies" ALTER COLUMN "plan_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "strategy_history" ALTER COLUMN "plan_id" SET NOT NULL;
