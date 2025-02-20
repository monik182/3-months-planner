'use client'
import { Alert, Box, Button, Card, Collapsible, Editable, Em, Flex, IconButton, List, Text } from '@chakra-ui/react'
import { StepLayout } from '@/app/plan/stepLayout'
import { SlClose, SlPlus } from 'react-icons/sl'
import { Status, Step } from '@/app/types/types'
import { usePlanContext } from '@/app/providers/usePlanContext'
import { IndicatorList } from '@/app/plan/Step3/Indicator/IndicatorList'
import { StrategyList } from '@/app/plan/Step3/Strategy/StrategyList'
import { Goal } from '@prisma/client'
import { useEffect, useState } from 'react'
import { OpenChangeDetails } from 'node_modules/@chakra-ui/react/dist/types/components/collapsible/namespace'
import cuid from 'cuid'
import { useDebouncedCallback } from 'use-debounce'
import { SavingSpinner } from '@/components/SavingSpinner'

const maxLimit = 4
export function Step3({ onLoading }: Step<Goal[]>) {
  const { plan, goalActions } = usePlanContext()
  const { data: _goals = [] } = goalActions.useGetByPlanId(plan?.id as string, Status.ACTIVE)
  const [goals, setGoals] = useState<Omit<Goal, 'status'>[]>([..._goals])
  const create = goalActions.useCreate()
  const update = goalActions.useUpdate()
  const remove = goalActions.useDelete()
  const loading = create.isPending || update.isPending || remove.isPending
  const canAdd = maxLimit ? goals.length < maxLimit : true

  const createGoal = () => {
    const newGoal = {
      id: cuid(),
      planId: plan!.id,
      content: '',
    }

    debouncedSave(newGoal)
  }

  const updateGoalContent = (id: string, content: string) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, content } : g))
    debouncedUpdate(id, content)
  }

  const removeGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id))
    debouncedRemove(id)
  }

  const saveGoal = (goal: Omit<Goal, 'status'>) => {
    create.mutate({...goal, plan: { connect: { id: plan!.id } }}, {
      onSuccess: () => {
        setGoals(prev => [...prev, goal])
      }
    })
  }

  const updateGoals = (id: string, content: string) => {
    update.mutate({ goalId: id, updates: { content } })
  }

  const deleteGoal = (id: string) => {
    remove.mutate(id)
  }

  const debouncedSave = useDebouncedCallback((goal: Omit<Goal, 'status'>) => saveGoal(goal), 1000)
  const debouncedUpdate = useDebouncedCallback((id: string, content: string) => updateGoals(id, content), 500)
  const debouncedRemove = useDebouncedCallback((id: string) => deleteGoal(id), 0)

  useEffect(() => {
    onLoading?.(loading)
  }, [loading])

  useEffect(() => {
    if (!loading) {
      setGoals(prev => {
        if (!prev.length) return _goals
        if (prev.length !== _goals.length) return _goals
        return prev
      })
    }
  }, [_goals, loading])

  return (
    <StepLayout
      title="Set your 1-Year Goals"
      description={Description()}
    >
      <Box flex="1" overflowY="auto" px={2} minHeight="0" display={!goals?.length ? "none" : "block"}>
        {goals.map((goal) => (
          <Card.Root key={goal.id} marginBottom="1rem">
            <Card.Header>
              <Flex key={goal.id} justify="space-between">
                <Editable.Root
                  value={goal.content}
                  placeholder="Click to edit"
                  defaultEdit
                  width="100%"
                  onValueChange={(e) => updateGoalContent(goal.id, e.value)}
                >
                  <Editable.Preview />
                  <Editable.Input autoComplete="off" />
                </Editable.Root>
                <IconButton
                  aria-label="Remove list goal"
                  variant="ghost"
                  size="sm"
                  disabled={update.isPending}
                  onClick={() => removeGoal(goal.id)}
                >
                  <SlClose />
                </IconButton>
              </Flex>
            </Card.Header>
            <Card.Body>
              <StrategyList goalId={goal.id} planId={goal.planId} maxLimit={5} onLoading={onLoading} />
            </Card.Body>
            <Card.Footer>
              <IndicatorList goalId={goal.id} planId={goal.planId} maxLimit={2} onLoading={onLoading} />
            </Card.Footer>
          </Card.Root>
        ))}
      </Box>
      <Button variant="ghost" className="mt-5" onClick={() => createGoal()}>
        <SlPlus /> New Goal
      </Button>
      <SavingSpinner loading={loading} />
      {!canAdd && (
        <Alert.Root status="info" size="sm" variant="outline">
          <Alert.Indicator />
          <Alert.Title>
            You have reached the maximum number of strategies for this goal
          </Alert.Title>
        </Alert.Root>
      )}
    </StepLayout>
  )
}

function Description() {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <Text textStyle="sm">Goals are the building blocks of your vision. They start with a clear action verb and are written as complete sentences.</Text>
      <Collapsible.Root lazyMount open={open} onOpenChange={(e: OpenChangeDetails) => setOpen(e.open)}>
        <Collapsible.Trigger paddingY="3">See {!open ? 'more' : 'less'}</Collapsible.Trigger>
        <Collapsible.Content>
          <Text textStyle="sm">To create effective goals, follow these criteria:</Text>
          <List.Root as="ol" className="my-2">
            <List.Item><Text textStyle="sm" className="inline"><b>Specific and Measurable:</b> Clearly define what you want to achieve and how progress or success will be measured.</Text></List.Item>
            <List.Item><Text textStyle="sm" className="inline"><b>Positive Framing:</b> Write your goals as affirmations of what you will accomplish, avoiding negative language.</Text></List.Item>
            <List.Item><Text textStyle="sm" className="inline"><b>Realistic Ambition:</b> Set goals that are challenging yet attainable within the resources and time you have.</Text></List.Item>
            <List.Item><Text textStyle="sm" className="inline"><b>Time-Bound:</b> Tie each goal to a specific due date, whether it marks the completion of the objective or the execution of the action.</Text></List.Item>
          </List.Root>
          <Text textStyle="sm">You can create up to 4 goals, with a maximum of 5 strategies for each goal, and up to 2 indicators per goal to track progress effectively.</Text>
          <Text textStyle="sm">Example: Instead of &apos;Stop procrastinating,&apos; write &apos;Complete my weekly project tasks by Friday.&apos; This ensures your goals are actionable, motivating, and directly tied to your progress.</Text>
          <Text textStyle="sm"><Em>You can add as many goals as you want, but for better results, focus on no more than three goals at a time. This will help you channel your energy and efforts effectively to maximize impact.</Em></Text>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  )
}
