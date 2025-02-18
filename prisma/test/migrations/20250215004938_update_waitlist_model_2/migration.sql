/*
  Warnings:

  - A unique constraint covering the columns `[invite_token]` on the table `waitlist` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "waitlist_email_id_idx";

-- AlterTable
ALTER TABLE "waitlist" ADD COLUMN     "invite_token" TEXT,
ADD COLUMN     "invited_at" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "waitlist_invite_token_key" ON "waitlist"("invite_token");

-- CreateIndex
CREATE INDEX "waitlist_email_id_invite_token_idx" ON "waitlist"("email", "id", "invite_token");
