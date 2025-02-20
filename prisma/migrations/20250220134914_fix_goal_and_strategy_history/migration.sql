/*
  Warnings:

  - A unique constraint covering the columns `[goal_id,sequence]` on the table `goal_history` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[strategy_id,sequence]` on the table `strategy_history` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "goal_history_goal_id_sequence_key" ON "goal_history"("goal_id", "sequence");

-- CreateIndex
CREATE UNIQUE INDEX "strategy_history_strategy_id_sequence_key" ON "strategy_history"("strategy_id", "sequence");
