import { usePlanContext } from '@/app/providers/usePlanContext'
import { IndicatorForm } from './IndicatorForm'
import { Button, Flex } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { SlPlus, SlStar } from 'react-icons/sl'
import { Indicator } from '@prisma/client'
import cuid from 'cuid'
import { SavingSpinner } from '@/components/SavingSpinner'
import { useDebouncedCallback } from 'use-debounce'

interface IndicatorListProps {
  goalId: string
  planId: string
  onLoading?: (loading: boolean) => void
}

export function IndicatorList({ goalId, planId, onLoading }: IndicatorListProps) {
  const { indicatorActions } = usePlanContext()
  const { data: _indicators = [] } = indicatorActions.useGetByGoalId(goalId)
  const [indicators, setIndicators] = useState<Omit<Indicator, 'status'>[]>([..._indicators])
  const disableIndicator = !!indicators.some((indicator) => indicator.initialValue == null || indicator.goalValue == null || !indicator.metric || !indicator.content)
  const [indicatorToUpdate, setIndicatorToUpdate] = useState<Omit<Indicator, 'status'> | null>()
  const create = indicatorActions.useCreate()
  const update = indicatorActions.useUpdate()
  const remove = indicatorActions.useDelete()
  const loading = create.isPending || update.isPending || remove.isPending

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
    const indicatorExists = !!_indicators.find(i => i.id === id)
    setIndicators(prev => prev.map(i => i.id === id ? { ...i, ...indicator } : i))
    setIndicatorToUpdate(null)
    if (indicatorExists) {
      updateIndicator(id, indicator)
    } else {
      saveIndicator(indicator as Indicator)
    }
  }

  const handleRemove = (id: string) => {
    setIndicators(prev => prev.filter(s => s.id !== id))
    setIndicatorToUpdate(null)
    const indicatorExists = !!_indicators.find(i => i.id === id)
    if (indicatorExists) {
      debouncedRemove(id)
    }
  }

  const saveIndicator = (indicator: Omit<Indicator, 'status'>) => {
    create.mutate({ ...indicator, goal: { connect: { id: goalId } } })
  }

  const updateIndicator = (id: string, updates: Partial<Indicator>) => {
    update.mutate({ indicatorId: id, updates })
  }

  const removeIndicator = (id: string) => {
    remove.mutate(id)
  }

  const debouncedRemove = useDebouncedCallback((id: string) => removeIndicator(id), 0)

  useEffect(() => {
    onLoading?.(loading)
  }, [loading])

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
      <SavingSpinner loading={loading} />
      <Button size="xs" variant="outline" className="mt-5" onClick={handleCreate} disabled={disableIndicator}>
        <SlPlus /> Add Indicator
      </Button>
    </Flex>
  )
}
