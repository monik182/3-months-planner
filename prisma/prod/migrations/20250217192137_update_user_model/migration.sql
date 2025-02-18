-- CreateEnum
CREATE TYPE "Role" AS ENUM ('GUEST', 'USER', 'SUBSCRIBER', 'ADMIN', 'SUPERADMIN');

-- DropIndex
DROP INDEX "users_email_id_waitlist_id_idx";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- CreateIndex
CREATE INDEX "users_email_id_waitlist_id_role_idx" ON "users"("email", "id", "waitlist_id", "role");
