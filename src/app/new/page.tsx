'use client'
import { DateSelector } from '@/components/DateSelector'
import { usePlanContext } from '@/app/providers/usePlanContext'
import { calculatePlanEndDate, formatDate, getPlanStartDate } from '@/app/util'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { toaster } from '@/components/ui/toaster'
import { Center, Flex, Link } from '@chakra-ui/react'
import { Prisma } from '@prisma/client'
import dayjs from 'dayjs'
import { useState } from 'react'
import { SlNotebook } from 'react-icons/sl'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/providers/AuthProvider'
import NextLink from 'next/link'

function NewPlan() {
  const router = useRouter()
  const { user } = useAuth()
  const { planActions, hasPlan } = usePlanContext()
  const createPlan = planActions.useCreate()
  const [startDate, setStartDate] = useState<string | undefined>(formatDate(getPlanStartDate(), 'YYYY-MM-DD'))
  const [created, setCreated] = useState(false)

  const handleCreateNewPlan = () => {
    const date = dayjs(startDate).toDate()
    const now = dayjs().toDate()
    
    const plan: Prisma.PlanCreateInput = {
      startDate: date,
      users: {
        connect: {
          id: user!.id as string,
        }
      },
      endDate: calculatePlanEndDate(date),
      created: now,
      lastUpdate: now,
    }
    createPlan.mutate(plan, {
      onSuccess() {
        toaster.create({
          title: 'Plan successfully created',
          type: 'success'
        })
        setCreated(true)
        window.location.href = '/plan'
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

  if (hasPlan || created) {
    return (
      <Center>
        <EmptyState
          icon={<SlNotebook />}
          size="lg"
          title={created ? 'Plan created' : 'Plan in progress'}
          description={created ? 'Your plan has been created successfully.' : 'You already have a plan in progress.'}
        >
          <Button colorPalette="cyan">
            <Link asChild color="white" variant="plain" textDecoration="none">
              <NextLink href="/plan">Go To Plan</NextLink>
            </Link>
          </Button>
        </EmptyState>
      </Center>
    )
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
