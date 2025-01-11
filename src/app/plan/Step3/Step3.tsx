'use client'
import { Box, Button, Card, Editable, Em, Flex, IconButton, List, Text } from '@chakra-ui/react'
import { StepLayout } from '@/app/plan/stepLayout'
import { SlClose, SlPlus } from 'react-icons/sl'
import { Goal, Step } from '@/app/types'
import { usePlanContext } from '@/app/providers/usePlanContext'
import { IndicatorList } from '@/app/plan/Step3/Indicator/IndicatorList'
import { StrategyList } from '@/app/plan/Step3/Strategy/StrategyList'

export function Step3({ }: Step<Goal[]>) {
  const { 
    goals, createGoal, updateGoal, removeGoal,
  } = usePlanContext()

  const updateGoalContent = (id: string, content: string) => {
    updateGoal(id, { content })
  }

  return (
    <StepLayout
      title="Set your 1-Year Goals"
      description={description}
    >
      <Box flex="1" overflowY="auto" px={2} minHeight="0">
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
                  <Editable.Input />
                </Editable.Root>
                <IconButton
                  aria-label="Remove list goal"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeGoal(goal.id)}
                >
                  <SlClose />
                </IconButton>
              </Flex>
            </Card.Header>
            <Card.Body>
              <StrategyList goalId={goal.id} />
            </Card.Body>
            <Card.Footer>
                <IndicatorList goalId={goal.id} />
            </Card.Footer>
          </Card.Root>
        ))}
      </Box>

      <Button variant="outline" className="mt-5" onClick={() => createGoal()}>
        <SlPlus /> New Goal
      </Button>
    </StepLayout>
  )
}

const description = (
  <div>
    <Text textStyle="sm">Goals are the building blocks of your vision. They start with a clear action verb and are written as complete sentences. To create effective goals, follow these criteria:</Text>
    <List.Root as="ol" className="my-2">
      <List.Item><Text textStyle="sm" className="inline"><b>Specific and Measurable:</b> Clearly define what you want to achieve and how progress or success will be measured.</Text></List.Item>
      <List.Item><Text textStyle="sm" className="inline"><b>Positive Framing:</b> Write your goals as affirmations of what you will accomplish, avoiding negative language.</Text></List.Item>
      <List.Item><Text textStyle="sm" className="inline"><b>Realistic Ambition:</b> Set goals that are challenging yet attainable within the resources and time you have.</Text></List.Item>
      <List.Item><Text textStyle="sm" className="inline"><b>Time-Bound:</b> Tie each goal to a specific due date, whether it marks the completion of the objective or the execution of the action.</Text></List.Item>
    </List.Root>
    <Text textStyle="sm">Example: Instead of &apos;Stop procrastinating,&apos; write &apos;Complete my weekly project tasks by Friday.&apos; This ensures your goals are actionable, motivating, and directly tied to your progress.</Text>
    <Text textStyle="sm"><Em>You can add as many goals as you want, but for better results, focus on no more than three goals at a time. This will help you channel your energy and efforts effectively to maximize impact.</Em></Text>
  </div>
)
