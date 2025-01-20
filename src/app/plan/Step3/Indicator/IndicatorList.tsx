import { usePlanContext } from '@/app/providers/usePlanContext'
import { IndicatorForm } from './IndicatorForm'
import { Button, Flex } from '@chakra-ui/react'
import { useState } from 'react'
import { SlPlus, SlStar } from 'react-icons/sl'
import { Indicator } from '@prisma/client'
import cuid from 'cuid'

interface IndicatorListProps {
  goalId: string
  planId: string
}

export function IndicatorList({ goalId, planId }: IndicatorListProps) {
  const { indicatorActions } = usePlanContext()
  const { data: _indicators = [] } = indicatorActions.useGetByGoalId(goalId)
  const [indicators, setIndicators] = useState<Omit<Indicator, 'status'>[]>([..._indicators])
  const disableIndicator = !!indicators.some((indicator) => indicator.initialValue == null || indicator.goalValue == null || !indicator.metric || !indicator.content)
  const [indicatorToUpdate, setIndicatorToUpdate] = useState<Omit<Indicator, 'status'> | null>()

  const handleCreate = () => {
    const newIndicator: Omit<Indicator, 'status'> = {
      id: cuid(),
      goalId,
      planId,
      content: '',
      metric: '',
      initialValue: 0,
      goalValue: 0,
    }
    setIndicators(prev => [...prev, newIndicator])
    setIndicatorToUpdate(newIndicator)
  }

  const handleChange = (id: string, indicator: Partial<Indicator>) => {
    setIndicators(prev => prev.map(i => i.id === id ? { ...i, ...indicator } : i))
    setIndicatorToUpdate(null)
  }

  const handleRemove = (id: string) => {
    setIndicators(prev => prev.filter(s => s.id !== id))
    setIndicatorToUpdate(null)
  }

  return (
    <Flex gap="10px" direction="column" wrap="wrap">
      {!!indicatorToUpdate && (
        <IndicatorForm
          indicator={indicatorToUpdate}
          onChange={(indicator) => handleChange(indicatorToUpdate.id, indicator)}
          onRemove={() => handleRemove(indicatorToUpdate.id)}
        />
      )}
      <Flex gap="10px">
        {indicators.map((indicator) => (
          <Button key={indicator.id} variant="outline" colorPalette="yellow" className="mt-5" onClick={() => setIndicatorToUpdate(indicator)}>
            <SlStar /> {indicator.content}
          </Button>
        ))}
      </Flex>
      <Button size="xs" variant="outline" className="mt-5" onClick={handleCreate} disabled={disableIndicator}>
        <SlPlus /> Add Indicator
      </Button>
    </Flex>
  )
}
