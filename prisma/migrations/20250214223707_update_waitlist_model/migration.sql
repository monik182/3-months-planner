/*
  Warnings:

  - You are about to drop the `Waitlist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Waitlist";

-- CreateTable
CREATE TABLE "waitlist" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "invited" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "waitlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "waitlist_email_key" ON "waitlist"("email");

-- CreateIndex
CREATE UNIQUE INDEX "waitlist_position_key" ON "waitlist"("position");

-- CreateIndex
CREATE INDEX "waitlist_email_id_idx" ON "waitlist"("email", "id");
