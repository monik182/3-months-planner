-- Update plans started status for today's start_date
-- Run daily at 00:00

UPDATE public.plans
SET started = true,
    last_update = NOW()
WHERE started = false
  AND completed = false
  AND start_date::date = CURRENT_DATE;
