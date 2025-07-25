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
import { useState } from 'react'
import { SlNotebook } from 'react-icons/sl'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/providers/AuthProvider'

function NewPlan() {
  const router = useRouter()
  const { user } = useAuth()
  const { planActions } = usePlanContext()
  const createPlan = planActions.useCreate()
  const [startDate, setStartDate] = useState<string | undefined>(formatDate(getPlanStartDate(), 'YYYY-MM-DD'))

  const handleCreateNewPlan = () => {
    const date = dayjs(startDate).toDate()
    const now = dayjs().toDate()
    
    const plan: Prisma.PlanCreateInput = {
      startDate: date,
      endDate: calculatePlanEndDate(date),
      created: now,
      lastUpdate: now,
      users: {
        connect: {
          id: user!.id as string,
        }
      }
    }
    createPlan.mutate(plan, {
      onSuccess() {
        toaster.create({
          title: 'Plan successfully created',
          type: 'success'
        })
        router.replace('/plan')
      },
      onError: (error) => {
        toaster.create({
          title: 'Error creating plan',
          type: 'error',
          description: error.message
        })
      }
    })
  }

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
          <Button onClick={handleCreateNewPlan} disabled={!startDate} loading={createPlan.isPending}>Create Plan</Button>
        </Flex>
      </EmptyState>
    </Center>
  )
}

export default NewPlan
