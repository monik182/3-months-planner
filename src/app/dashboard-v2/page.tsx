'use client';
import GoalCard from '@/app/dashboard-v2/GoalCard';
import CurrentWeekSummary from '@/app/dashboard-v2/CurrentWeekSummary';
import { usePlanContext } from '@/app/providers/usePlanContext';
import { DashboardProvider } from '@/app/dashboard/dashboardContext';
import { Grid } from '@chakra-ui/react';
import { getCurrentWeekFromStartDate } from '@/app/util';

export function DashboardV2() {
  const { plan, goalActions } = usePlanContext();
  const { data: goals = [], isLoading: loadingGoals } =
    goalActions.useGetByPlanId(plan?.id);

  if (!goals.length) {
    return null;
  }

  if (loadingGoals) {
    return <div>Loading...</div>;
  }

  const currentWeek = getCurrentWeekFromStartDate(plan?.startDate as Date) || 1;

  return (
    <>
      <CurrentWeekSummary />
      <Grid gap={6} gridTemplateColumns={{ base: '1fr', lg: '1fr 1fr' }}>
        {goals.map((g) => (
          <GoalCard key={g.id} goal={g} sequence={currentWeek} />
        ))}
      </Grid>
    </>
  );
}

function DashboardV2WithContext() {
  return (
    <DashboardProvider>
      <DashboardV2 />
    </DashboardProvider>
  )
}

export default DashboardV2WithContext;
