'use client';
import GoalCard from '@/app/dashboard/GoalCard';
import CurrentWeekSummary from '@/app/dashboard/CurrentWeekSummary';
import { usePlanContext } from '@/app/providers/usePlanContext';
import { DashboardProvider } from '@/app/dashboard-legacy/dashboardContext';
import { Grid } from '@chakra-ui/react';
import { Alert } from '@/components/ui/alert';
import { formatDate } from '@/app/util';
import { getCurrentWeekFromStartDate } from '@/app/util';
import { useState } from 'react';

export function DashboardV2() {
  const { plan, goalActions, hasStartedPlan } = usePlanContext();
  const currentWeek = getCurrentWeekFromStartDate(plan?.startDate as Date) || 1;
  const [activeWeek, setActiveWeek] = useState(currentWeek);
  const { data: goals = [], isLoading: loadingGoals } =
    goalActions.useGetByPlanId(plan?.id as string);

  if (!goals.length) {
    return null;
  }

  if (loadingGoals) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {!hasStartedPlan && (
        <Alert.Root status="info" variant="subtle" mb={4}>
          <Alert.Indicator />
          <Alert.Title>
            Your plan starts on {formatDate(plan?.startDate as Date, 'MMM DD, YYYY')}
          </Alert.Title>
        </Alert.Root>
      )}
      <CurrentWeekSummary
        activeWeek={activeWeek}
        setActiveWeek={setActiveWeek}
        disabled={!hasStartedPlan}
      />
      <Grid gap={6} gridTemplateColumns={{ base: '1fr', lg: '1fr 1fr' }}>
        {goals.map((g) => (
          <GoalCard key={g.id} goal={g} sequence={activeWeek} disabled={!hasStartedPlan} />
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
