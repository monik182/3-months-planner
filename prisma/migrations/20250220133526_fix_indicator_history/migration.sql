/*
  Warnings:

  - A unique constraint covering the columns `[indicator_id,sequence]` on the table `indicator_history` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "indicator_history_indicator_id_sequence_key" ON "indicator_history"("indicator_id", "sequence");
