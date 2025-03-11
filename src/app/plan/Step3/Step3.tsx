'use client'
import React, { useEffect, useState } from 'react'
import {
  Card,
  Collapsible,
  Editable,
  Flex,
  Text,
  Separator,
  Button,
  Alert,
  IconButton,
} from '@chakra-ui/react'
import { StepLayout } from '@/app/plan/stepLayout'
import { Status, Step } from '@/app/types/types'
import { usePlanContext } from '@/app/providers/usePlanContext'
import { IndicatorList } from '@/app/plan/Step3/Indicator/IndicatorList'
import { StrategyList } from '@/app/plan/Step3/Strategy/StrategyList'
import { Goal } from '@prisma/client'
import { useDebouncedCallback } from 'use-debounce'
import { SavingSpinner } from '@/components/SavingSpinner'
import cuid from 'cuid'
import { HiChevronDown, HiChevronUp } from 'react-icons/hi2'
import { IoIosClose } from 'react-icons/io'
import { GoPlus } from 'react-icons/go'

const MAX_GOALS = 4

export function Step3({ onLoading }: Step<Goal[]>) {
  const { plan, goalActions } = usePlanContext()
  const { data: _goals = [] } = goalActions.useGetByPlanId(plan?.id as string, Status.ACTIVE)
  const [goals, setGoals] = useState<Omit<Goal, 'status'>[]>([..._goals])
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const create = goalActions.useCreate()
  const update = goalActions.useUpdate()
  const remove = goalActions.useDelete()

  const loadingText = create.isPending ? 'Creating' : 'Saving'
  const loading = create.isPending || update.isPending || remove.isPending
  const canAdd = goals.length < MAX_GOALS

  const toggleDetails = () => {
    setDetailsOpen(!detailsOpen)
  }

  const toggleGoalExpansion = (goalId: string) => {
    setExpandedGoalId(expandedGoalId === goalId ? null : goalId)
  }

  const createGoal = () => {
    if (!canAdd) return

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
    create.mutate({ ...goal, plan: { connect: { id: plan!.id } } }, {
      onSuccess: () => {
        setGoals(prev => [...prev, goal])
        setExpandedGoalId(goal.id)
      }
    })
  }

  const updateGoals = (id: string, content: string) => {
    update.mutate({ goalId: id, updates: { content } })
  }

  const deleteGoal = (id: string) => {
    remove.mutate(id)
  }

  const debouncedSave = useDebouncedCallback((goal: Omit<Goal, 'status'>) => saveGoal(goal), 0)
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
  }, [_goals.length, loading])

  return (
    <StepLayout
      title="Set your 1-Year Goals"
      description={<GoalDescription open={detailsOpen} onToggle={toggleDetails} />}
    >
      <div className="space-y-4 w-full">
        {goals.map((goal) => (
          <Card.Root
            key={goal.id}
            variant="outline"
            className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <Card.Header className="bg-gray-50 p-4">
              <Flex justify="space-between" align="center">
                <Flex align="center" gap="2" flex="1" onClick={() => toggleGoalExpansion(goal.id)} className="cursor-pointer">
                  {expandedGoalId === goal.id ?
                    <HiChevronUp size={18} className="text-gray-500" /> :
                    <HiChevronDown size={18} className="text-gray-500" />
                  }
                  <Editable.Root
                    value={goal.content}
                    placeholder="Define your goal"
                    defaultEdit
                    width="100%"
                    onValueChange={(e) => updateGoalContent(goal.id, e.value)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Editable.Preview className="font-medium" />
                    <Editable.Input autoComplete="off" />
                  </Editable.Root>
                </Flex>
                <IconButton
                  aria-label="Remove goal"
                  variant="ghost"
                  size="sm"
                  disabled={update.isPending}
                  onClick={() => removeGoal(goal.id)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <IoIosClose size={16} />
                </IconButton>
              </Flex>
            </Card.Header>

            <Collapsible.Root open={expandedGoalId === goal.id}>
              <Collapsible.Content>
                <Card.Body className="p-4 bg-white">
                  <Text className="text-sm font-medium mb-2 text-gray-700">Strategies</Text>
                  <StrategyList goalId={goal.id} planId={goal.planId} maxLimit={5} onLoading={onLoading} />
                </Card.Body>
                <Separator />
                <Card.Footer className="p-4 bg-white">
                  <Flex flexDirection="column" gap="1rem">
                    <Text className="text-sm font-medium mb-2 text-gray-700">Progress Indicators</Text>
                    <IndicatorList goalId={goal.id} planId={goal.planId} maxLimit={2} onLoading={onLoading} />
                  </Flex>
                </Card.Footer>
              </Collapsible.Content>
            </Collapsible.Root>
          </Card.Root>
        ))}
        <SavingSpinner loading={loading} text={loadingText} />

        <Button
          variant="outline"
          onClick={createGoal}
          disabled={!canAdd || loading}
          className="border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <GoPlus size={18} className="mr-2" />
          Add Goal
        </Button>

        {!canAdd && (
          <Alert.Root status="info" size="sm" variant="outline" className="mt-4">
            <Alert.Indicator />
            <Alert.Title>
              You have reached the maximum limit of {MAX_GOALS} goals
            </Alert.Title>
          </Alert.Root>
        )}

        {goals.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <Text>No goals yet. Click the "Add Goal" button to create your first goal.</Text>
          </div>
        )}
      </div>
    </StepLayout>
  )
}

function GoalDescription({ open, onToggle }: { open: boolean, onToggle: () => void }) {
  return (
    <div className="text-gray-700">
      <Text textStyle="sm">Goals are the building blocks of your vision. They start with a clear action verb and are written as complete sentences.</Text>

      <Collapsible.Root open={open}>
        <Collapsible.Trigger
          onClick={onToggle}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 mt-2 mb-1"
        >
          {open ? 'Show less' : 'Show more'}
          {open ? <HiChevronUp size={16} className="ml-1" /> : <HiChevronDown size={16} className="ml-1" />}
        </Collapsible.Trigger>

        <Collapsible.Content className="text-sm space-y-2">
          <Text textStyle="sm">To create effective goals, follow these criteria:</Text>

          <ul className="list-disc pl-5 space-y-1">
            <li><Text textStyle="sm"><strong>Specific and Measurable:</strong> Clearly define what you want to achieve and how progress will be measured.</Text></li>
            <li><Text textStyle="sm"><strong>Positive Framing:</strong> Write goals as affirmations of what you will accomplish.</Text></li>
            <li><Text textStyle="sm"><strong>Realistic Ambition:</strong> Set goals that are challenging yet attainable.</Text></li>
            <li><Text textStyle="sm"><strong>Time-Bound:</strong> Tie each goal to a specific due date.</Text></li>
          </ul>

          <Text textStyle="sm" className="italic">Focus on no more than three goals at a time for maximum effectiveness.</Text>

          <div className="bg-gray-50 p-3 rounded-md border border-gray-200 mt-2">
            <Text textStyle="sm" className="font-medium">Example:</Text>
            <Text textStyle="sm">Instead of "Stop procrastinating," write "Complete my weekly project tasks by Friday."</Text>
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  )
}
