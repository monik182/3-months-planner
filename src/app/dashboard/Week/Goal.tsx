import { Box, Card, Flex, SimpleGrid } from '@chakra-ui/react'
import { Goal } from '@/types'
import { Strategy } from './Strategy'
import { Indicator } from './Indicator'

interface GoalProps {
  goal: Goal
}

export function Goal({ goal }: GoalProps) {
  // const goalProgress = 100

  return (
    <Box>
      <Card.Root>
        <Card.Body gap="2">
          <Card.Header>
            <Flex alignItems="center" justifyContent="space-between">
              <Card.Title mt="2">{goal.content}</Card.Title>
              <p>Score: {goal.score}%</p>
            </Flex>
          </Card.Header>
          <Card.Description>
            <Flex gap="3" direction="column">
              {goal.strategies.map((strategy) => (<Strategy key={strategy.id} strategy={strategy} />))}
            </Flex>
          </Card.Description>
        </Card.Body>
        <Card.Footer>
          <SimpleGrid columns={3} gap="10px">
            {goal.indicators.map((indicator) => (<Indicator key={indicator.id} indicator={indicator} />))}
          </SimpleGrid>
        </Card.Footer>
      </Card.Root>
    </Box>
  )
}
