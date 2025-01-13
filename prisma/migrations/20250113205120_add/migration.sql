-- AlterTable
ALTER TABLE "goal_history" ADD COLUMN     "plan_id" TEXT;

-- AlterTable
ALTER TABLE "indicator_history" ADD COLUMN     "plan_id" TEXT;

-- AlterTable
ALTER TABLE "indicators" ADD COLUMN     "plan_id" TEXT;

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "plan_id" TEXT;

-- AlterTable
ALTER TABLE "strategies" ADD COLUMN     "plan_id" TEXT;

-- AlterTable
ALTER TABLE "strategy_history" ADD COLUMN     "plan_id" TEXT;

-- CreateIndex
CREATE INDEX "goal_history_plan_id_idx" ON "goal_history"("plan_id");

-- CreateIndex
CREATE INDEX "indicator_history_plan_id_idx" ON "indicator_history"("plan_id");

-- CreateIndex
CREATE INDEX "indicators_plan_id_idx" ON "indicators"("plan_id");

-- CreateIndex
CREATE INDEX "strategies_plan_id_idx" ON "strategies"("plan_id");

-- CreateIndex
CREATE INDEX "strategy_history_plan_id_idx" ON "strategy_history"("plan_id");
