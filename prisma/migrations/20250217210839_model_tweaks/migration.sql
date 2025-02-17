-- DropIndex
DROP INDEX "users_auth0_id_key";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "auth0_id" DROP NOT NULL;
