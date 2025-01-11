import { usePlanContext } from '@/app/providers/usePlanContext'
import { IndicatorForm } from './IndicatorForm'
import { Indicator } from '@/app/types'
import { Button, Flex } from '@chakra-ui/react'
import { useState } from 'react'
import { SlPlus, SlStar } from 'react-icons/sl'

interface IndicatorListProps {
  goalId: string
}

export function IndicatorList({ goalId }: IndicatorListProps) {
  const {
    indicators, createIndicator, updateIndicator, removeIndicator,
  } = usePlanContext()
  const filteredIndicators = indicators.filter(i => i.goalId === goalId)
  const disableIndicator = !!filteredIndicators.some((indicator) => indicator.startingValue == null || indicator.goalValue == null || !indicator.metric || !indicator.content)
  const [indicatorToUpdate, setIndicatorToUpdate] = useState<Indicator | null>()

  const handleCreate = () => {
    const newIndicator = createIndicator(goalId)
    if (newIndicator?.id) {
      setIndicatorToUpdate(newIndicator)
    }
  }

  const handleChange = (id: string, indicator: Partial<Indicator>) => {
    updateIndicator(id, indicator)
    setIndicatorToUpdate(null)
  }

  const handleRemove = (id: string) => {
    removeIndicator(id)
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
        {filteredIndicators.map((indicator) => (
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
