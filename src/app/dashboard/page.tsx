'use client';
import GoalCard from '@/app/dashboard/GoalCard';
import CurrentWeekSummary from '@/app/dashboard/CurrentWeekSummary';
import { usePlanContext } from '@/app/providers/usePlanContext';
import { DashboardProvider } from '@/app/dashboard-legacy/dashboardContext';
import { Grid, Center, Alert, Link } from '@chakra-ui/react';
import { formatDate } from '@/app/util';
import { getCurrentWeekFromStartDate } from '@/app/util';
import { useState } from 'react';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import NextLink from 'next/link';
import { LuTarget } from 'react-icons/lu';

function DashboardV2() {
  const { plan, goalActions, hasStartedPlan } = usePlanContext();
  const currentWeek = getCurrentWeekFromStartDate(plan?.startDate as Date) || 1;
  const [activeWeek, setActiveWeek] = useState(currentWeek);
  const { data: goals = [], isLoading: loadingGoals } =
    goalActions.useGetByPlanId(plan?.id as string);

  if (loadingGoals) {
    return <div>Loading...</div>;
  }

  if (!goals.length) {
    return (
      <Center h="full">
        <EmptyState
          icon={<LuTarget />}
          size="lg"
          title="No Goals Yet"
          description="Head over to your plan and add a goal to get started"
        >
          <Button colorPalette="cyan">
            <Link asChild color="white" variant="plain" textDecoration="none">
              <NextLink href="/plan">Go To Plan</NextLink>
            </Link>
          </Button>
        </EmptyState>
      </Center>
    );
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
      />
      <Grid gap={6} gridTemplateColumns={{ base: '1fr', lg: '1fr 1fr' }}>
        {goals.map((g) => (
          <GoalCard key={g.id} goal={g} sequence={activeWeek} />
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
