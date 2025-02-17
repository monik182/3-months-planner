'use client'
import { DateSelector } from '@/components/DateSelector'
import { usePlanContext } from '@/app/providers/usePlanContext'
import { calculatePlanEndDate, formatDate, getPlanStartDate } from '@/app/util'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { toaster } from '@/components/ui/toaster'
import { Center, Flex } from '@chakra-ui/react'
import { Prisma } from '@prisma/client'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SlNotebook } from 'react-icons/sl'
import { useAccountContext } from '@/app/providers/useAccountContext'

export default function NewPlan() {
  const router = useRouter()
  const { user } = useAccountContext()
  const { plan, planActions } = usePlanContext()
  const createPlan = planActions.useCreate()
  const [startDate, setStartDate] = useState<string | undefined>(formatDate(getPlanStartDate(), 'YYYY-MM-DD'))

  const handleCreateNewPlan = () => {
    const date = dayjs(startDate).toDate()
    
    const plan: Prisma.PlanCreateInput = {
      startDate: date,
      userId: user!.sub as string,
      endDate: calculatePlanEndDate(date)
    }
    createPlan.mutate(plan, {
      onSuccess() {
        toaster.create({
          title: 'Plan successfully created',
          type: 'success'
        })
      },
    })
  }

  useEffect(() => {
    if (!!plan) {
      router.replace('/plan')
    }
  }, [plan, router])

  return (
    <Center>
      <EmptyState
        icon={<SlNotebook />}
        size="lg"
        title="Create a new plan"
        description="Select the start date to get started"
      >
        <Flex gap="1rem" direction="column">
          <DateSelector onChange={setStartDate} date={startDate} />
          <Button onClick={handleCreateNewPlan} disabled={!startDate} loading={createPlan.isPending}>Create plan</Button>
        </Flex>
      </EmptyState>
    </Center>
  )
}
