-- DropIndex
DROP INDEX "feedbacks_email_key";

-- AlterTable
ALTER TABLE "feedbacks" ALTER COLUMN "email" DROP NOT NULL;
