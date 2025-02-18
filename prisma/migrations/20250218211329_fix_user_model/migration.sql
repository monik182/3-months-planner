-- DropIndex
DROP INDEX "users_email_id_waitlist_id_role_idx";

-- CreateIndex
CREATE INDEX "users_email_id_waitlist_id_role_auth0_id_idx" ON "users"("email", "id", "waitlist_id", "role", "auth0_id");
