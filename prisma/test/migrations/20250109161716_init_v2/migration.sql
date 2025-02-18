/*
  Warnings:

  - You are about to drop the `Goal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Indicator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Plan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Strategy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Week` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Goal" DROP CONSTRAINT "Goal_planId_fkey";

-- DropForeignKey
ALTER TABLE "Goal" DROP CONSTRAINT "Goal_weekId_fkey";

-- DropForeignKey
ALTER TABLE "Indicator" DROP CONSTRAINT "Indicator_goalId_fkey";

-- DropForeignKey
ALTER TABLE "Indicator" DROP CONSTRAINT "Indicator_weekId_fkey";

-- DropForeignKey
ALTER TABLE "Strategy" DROP CONSTRAINT "Strategy_goalId_fkey";

-- DropForeignKey
ALTER TABLE "Strategy" DROP CONSTRAINT "Strategy_weekId_fkey";

-- DropForeignKey
ALTER TABLE "Week" DROP CONSTRAINT "Week_planId_fkey";

-- DropTable
DROP TABLE "Goal";

-- DropTable
DROP TABLE "Indicator";

-- DropTable
DROP TABLE "Plan";

-- DropTable
DROP TABLE "Strategy";

-- DropTable
DROP TABLE "Week";

-- CreateTable
CREATE TABLE "plans" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "vision" TEXT NOT NULL,
    "milestone" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_update" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goals" (
    "id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goal_history" (
    "id" TEXT NOT NULL,
    "goal_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "goal_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strategies" (
    "id" TEXT NOT NULL,
    "goal_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "weeks" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "strategies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strategy_history" (
    "id" TEXT NOT NULL,
    "strategy_id" TEXT NOT NULL,
    "overdue" BOOLEAN NOT NULL DEFAULT false,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "first_update" TIMESTAMP(3),
    "last_update" TIMESTAMP(3),

    CONSTRAINT "strategy_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indicators" (
    "id" TEXT NOT NULL,
    "goal_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "starting_value" DOUBLE PRECISION NOT NULL,
    "goal_value" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "indicators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indicator_history" (
    "id" TEXT NOT NULL,
    "indicator_id" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "indicator_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "send_date" TIMESTAMP(3) NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_update" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "plans_user_id_idx" ON "plans"("user_id");

-- CreateIndex
CREATE INDEX "goals_plan_id_idx" ON "goals"("plan_id");

-- CreateIndex
CREATE INDEX "goal_history_goal_id_idx" ON "goal_history"("goal_id");

-- CreateIndex
CREATE INDEX "strategies_goal_id_idx" ON "strategies"("goal_id");

-- CreateIndex
CREATE INDEX "strategy_history_strategy_id_idx" ON "strategy_history"("strategy_id");

-- CreateIndex
CREATE INDEX "indicators_goal_id_idx" ON "indicators"("goal_id");

-- CreateIndex
CREATE INDEX "indicator_history_indicator_id_idx" ON "indicator_history"("indicator_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- CreateIndex
CREATE INDEX "notifications_entity_type_entity_id_idx" ON "notifications"("entity_type", "entity_id");

-- AddForeignKey
ALTER TABLE "plans" ADD CONSTRAINT "plans_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goal_history" ADD CONSTRAINT "goal_history_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "goals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "strategies" ADD CONSTRAINT "strategies_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "goals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "strategy_history" ADD CONSTRAINT "strategy_history_strategy_id_fkey" FOREIGN KEY ("strategy_id") REFERENCES "strategies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicators" ADD CONSTRAINT "indicators_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "goals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicator_history" ADD CONSTRAINT "indicator_history_indicator_id_fkey" FOREIGN KEY ("indicator_id") REFERENCES "indicators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
