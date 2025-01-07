-- Plans Table
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vision TEXT NULL,
  three_year_milestone TEXT NULL,
  plan_start_date DATE NULL,
  plan_end_date DATE NULL,
  completed BOOLEAN DEFAULT false NOT NULL
);

-- Weeks Table
CREATE TABLE weeks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES plans(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  week_number INTEGER NOT NULL,
  score NUMERIC NULL
);

-- Goals Table
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES plans(id) ON DELETE CASCADE,
  week_id UUID REFERENCES weeks(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  score NUMERIC NULL
);

-- Strategies Table
CREATE TABLE strategies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
  week_id UUID REFERENCES weeks(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  checked BOOLEAN NOT NULL DEFAULT FALSE,
  first_updated TIMESTAMP NULL,
  last_updated TIMESTAMP NULL,
  overdue BOOLEAN NOT NULL DEFAULT FALSE
);

-- Indicators Table
CREATE TABLE indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
  week_id UUID REFERENCES weeks(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  start_value INTEGER NULL,
  goal_value INTEGER NULL,
  current_value INTEGER NOT NULL,
  trend_value NUMERIC NOT NULL,
  metric_unit TEXT NOT NULL
);

create policy "public can read plans"
on public.plans
for select to anon
using (true);


create policy "public can read weeks"
on public.weeks
for select to anon
using (true);


create policy "public can read goals"
on public.goals
for select to anon
using (true);


create policy "public can read strategies"
on public.strategies
for select to anon
using (true);


create policy "public can read indicators"
on public.indicators
for select to anon
using (true);