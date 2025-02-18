/*
  Warnings:

  - You are about to drop the column `auth0Id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[auth0_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `auth0_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_auth0Id_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "auth0Id",
DROP COLUMN "createdAt",
ADD COLUMN     "auth0_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "users_auth0_id_key" ON "users"("auth0_id");
