import { Box, Card, Input } from '@chakra-ui/react'
import { Checkbox } from '../../../components/ui/checkbox'
import { useState } from 'react'
import { StatDownTrend, StatLabel, StatRoot, StatValueText } from '../../../components/ui/stat'
import dayjs from 'dayjs'
import { WeekTracking } from '../../types'

interface WeekProps {
  week: WeekTracking
}

export function Week({ week }: WeekProps) {
  const [checked, setChecked] = useState(true)
  const formattedStartDate = dayjs(week.startDate).format('DD MMM')
  const formattedEndDate = dayjs(week.endDate).format('DD MMM')

  return (
    <Box>
      <Box>
        <p>Week {week.weekNumber}: {formattedStartDate} - {formattedEndDate}</p>
      </Box>
      <Card.Root width="320px">
        <Card.Body gap="2">
          <Card.Header>
            <Card.Title mt="2">My important objective</Card.Title>
            <p>Progress of my goal: {checked ? 100 : 0}%</p>
          </Card.Header>
          <Card.Description>
            <ul>
              <li>
                <Checkbox
                  checked={checked}
                  onCheckedChange={(e) => setChecked(!!e.checked)}
                >
                  My current task
                </Checkbox>
              </li>
            </ul>
          </Card.Description>
        </Card.Body>
        <Card.Footer justifyContent="flex-end">
          <StatRoot>
            <StatLabel info="Target: 100">Indicator one</StatLabel>
            {/* <StatValueText>192.1k</StatValueText> */}
            <StatValueText>
              <Input placeholder="Enter your indicator value" value={10} />
            </StatValueText>
            <StatDownTrend variant="plain" px="0">
              1.9%
            </StatDownTrend>
          </StatRoot>
        </Card.Footer>
      </Card.Root>
    </Box>
  )
}
