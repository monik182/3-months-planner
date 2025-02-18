-- DropForeignKey
ALTER TABLE "goal_history" DROP CONSTRAINT "goal_history_goal_id_fkey";

-- DropForeignKey
ALTER TABLE "goals" DROP CONSTRAINT "goals_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "indicator_history" DROP CONSTRAINT "indicator_history_indicator_id_fkey";

-- DropForeignKey
ALTER TABLE "indicators" DROP CONSTRAINT "indicators_goal_id_fkey";

-- DropForeignKey
ALTER TABLE "strategies" DROP CONSTRAINT "strategies_goal_id_fkey";

-- DropForeignKey
ALTER TABLE "strategy_history" DROP CONSTRAINT "strategy_history_strategy_id_fkey";

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goal_history" ADD CONSTRAINT "goal_history_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "strategies" ADD CONSTRAINT "strategies_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "strategy_history" ADD CONSTRAINT "strategy_history_strategy_id_fkey" FOREIGN KEY ("strategy_id") REFERENCES "strategies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicators" ADD CONSTRAINT "indicators_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicator_history" ADD CONSTRAINT "indicator_history_indicator_id_fkey" FOREIGN KEY ("indicator_id") REFERENCES "indicators"("id") ON DELETE CASCADE ON UPDATE CASCADE;
