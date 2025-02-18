-- CreateEnum
CREATE TYPE "Role" AS ENUM ('GUEST', 'USER', 'SUBSCRIBER', 'ADMIN', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'TRIAL', 'CANCELED', 'EXPIRED', 'PAUSED', 'PENDING', 'GRACE_PERIOD', 'RENEWAL_DUE', 'FAILED', 'UPCOMING');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('FREE', 'BASIC', 'PREMIUM');

-- CreateTable
CREATE TABLE "plans" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "vision" TEXT NOT NULL DEFAULT '',
    "milestone" TEXT NOT NULL DEFAULT '',
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "started" BOOLEAN NOT NULL DEFAULT false,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_update" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goals" (
    "id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT '1',

    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goal_history" (
    "id" TEXT NOT NULL,
    "goal_id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,

    CONSTRAINT "goal_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strategies" (
    "id" TEXT NOT NULL,
    "goal_id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "weeks" TEXT[],
    "status" TEXT NOT NULL DEFAULT '1',
    "frequency" INTEGER NOT NULL,

    CONSTRAINT "strategies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strategy_history" (
    "id" TEXT NOT NULL,
    "strategy_id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "overdue" BOOLEAN NOT NULL DEFAULT false,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "first_update" TIMESTAMP(3),
    "last_update" TIMESTAMP(3),
    "sequence" INTEGER NOT NULL,
    "frequencies" BOOLEAN[] DEFAULT ARRAY[]::BOOLEAN[],

    CONSTRAINT "strategy_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indicators" (
    "id" TEXT NOT NULL,
    "goal_id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "initial_value" INTEGER NOT NULL,
    "goal_value" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT '1',

    CONSTRAINT "indicators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indicator_history" (
    "id" TEXT NOT NULL,
    "indicator_id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 0,
    "sequence" INTEGER NOT NULL,

    CONSTRAINT "indicator_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "send_date" TIMESTAMP(3) NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_update" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "waitlist" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "invited" BOOLEAN NOT NULL DEFAULT false,
    "invite_token" TEXT,
    "invited_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "waitlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedbacks" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "email" TEXT,
    "feedback" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "auth0_id" TEXT,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "waitlist_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "plan" "SubscriptionPlan" NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "renewal_date" TIMESTAMP(3),
    "canceled_at" TIMESTAMP(3),
    "trial_ends_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "goals_plan_id_idx" ON "goals"("plan_id");

-- CreateIndex
CREATE INDEX "goal_history_goal_id_idx" ON "goal_history"("goal_id");

-- CreateIndex
CREATE INDEX "goal_history_plan_id_idx" ON "goal_history"("plan_id");

-- CreateIndex
CREATE INDEX "strategies_goal_id_idx" ON "strategies"("goal_id");

-- CreateIndex
CREATE INDEX "strategies_plan_id_idx" ON "strategies"("plan_id");

-- CreateIndex
CREATE INDEX "strategy_history_strategy_id_idx" ON "strategy_history"("strategy_id");

-- CreateIndex
CREATE INDEX "strategy_history_plan_id_idx" ON "strategy_history"("plan_id");

-- CreateIndex
CREATE INDEX "indicators_goal_id_idx" ON "indicators"("goal_id");

-- CreateIndex
CREATE INDEX "indicators_plan_id_idx" ON "indicators"("plan_id");

-- CreateIndex
CREATE INDEX "indicator_history_indicator_id_idx" ON "indicator_history"("indicator_id");

-- CreateIndex
CREATE INDEX "indicator_history_plan_id_idx" ON "indicator_history"("plan_id");

-- CreateIndex
CREATE INDEX "notifications_entity_type_entity_id_idx" ON "notifications"("entity_type", "entity_id");

-- CreateIndex
CREATE UNIQUE INDEX "waitlist_email_key" ON "waitlist"("email");

-- CreateIndex
CREATE UNIQUE INDEX "waitlist_position_key" ON "waitlist"("position");

-- CreateIndex
CREATE UNIQUE INDEX "waitlist_invite_token_key" ON "waitlist"("invite_token");

-- CreateIndex
CREATE INDEX "waitlist_email_id_invite_token_idx" ON "waitlist"("email", "id", "invite_token");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_waitlist_id_key" ON "users"("waitlist_id");

-- CreateIndex
CREATE INDEX "users_email_id_waitlist_id_role_idx" ON "users"("email", "id", "waitlist_id", "role");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_user_id_key" ON "subscriptions"("user_id");

-- CreateIndex
CREATE INDEX "subscriptions_user_id_status_idx" ON "subscriptions"("user_id", "status");

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

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
