'use client';
import GoalCard from '@/app/dashboard-v2/GoalCard';
import { usePlanContext } from '@/app/providers/usePlanContext';

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

  return <div>
    <GoalCard goal={goals[0]} sequence={1} />
  </div>;
}

export default DashboardV2;
