import { Box, Card } from '@chakra-ui/react'
import { GoalTracking } from '@/types'
import { Strategy } from './Strategy'
import { Indicator } from './Indicator'

interface GoalProps {
  goal: GoalTracking
}

export function Goal({ goal }: GoalProps) {
  const goalProgress = 100
  return (
    <Box>
      <Card.Root width="320px">
        <Card.Body gap="2">
          <Card.Header>
            <Card.Title mt="2">{goal.content}</Card.Title>
            <p>Progress of my goal: {goalProgress}%</p>
          </Card.Header>
          <Card.Description>
            {goal.strategies.map((strategy) => (<Strategy key={strategy.id} strategy={strategy} />))}
          </Card.Description>
        </Card.Body>
        <Card.Footer justifyContent="flex-end">
          {goal.indicators.map((indicator) => (<Indicator key={indicator.id} indicator={indicator} />))}
        </Card.Footer>
      </Card.Root>
    </Box>
  )
}
