import { usePlanContext } from '@/app/providers/usePlanContext'
import { IndicatorForm } from './IndicatorForm'
import { Alert, Button, Flex, Tag } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { SlPlus } from 'react-icons/sl'
import { Indicator } from '@prisma/client'
import cuid from 'cuid'
import { SavingSpinner } from '@/components/SavingSpinner'
import { useDebouncedCallback } from 'use-debounce'
import { GoGraph } from 'react-icons/go'
import { Status } from '@/app/types/types'

interface IndicatorListProps {
  goalId: string
  planId: string
  maxLimit?: number
  onLoading?: (loading: boolean) => void
}

export function IndicatorList({ goalId, planId, maxLimit, onLoading }: IndicatorListProps) {
  const { indicatorActions } = usePlanContext()
  const { data: indicators = [] } = indicatorActions.useGetByGoalId(goalId)
  const [indicatorToUpdate, setIndicatorToUpdate] = useState<Indicator | null>()
  const create = indicatorActions.useCreate()
  const update = indicatorActions.useUpdate()
  const remove = indicatorActions.useDelete()
  const loadingText = create.isPending ? 'Creating' : 'Saving'
  const loading = create.isPending || update.isPending || remove.isPending
  const canAdd = maxLimit ? indicators.length < maxLimit : true
  const disableIndicator = !canAdd || !!indicators.some((indicator) => indicator.initialValue == null || indicator.goalValue == null || !indicator.metric || !indicator.content)

  const handleCreate = () => {
    const newIndicator: Indicator = {
      id: cuid(),
      goalId,
      planId,
      content: '',
      metric: '',
      initialValue: 0,
      goalValue: 0,
      status: Status.ACTIVE,
    }
    setIndicatorToUpdate(newIndicator)
  }

  const handleChange = (id: string, indicator: Partial<Indicator>) => {
    const indicatorExists = !!indicators.find(i => i.id === id)
    if (indicatorExists) {
      updateIndicator(id, indicator)
    } else {
      saveIndicator(indicator as Indicator)
    }
  }

  const handleRemove = (id: string) => {
    setIndicatorToUpdate(null)
    const indicatorExists = !!indicators.find(i => i.id === id)
    if (indicatorExists) {
      debouncedRemove(id)
    }
  }

  const saveIndicator = (indicator: Indicator) => {
    create.mutate(indicator, {
      onSuccess: () => {
        setIndicatorToUpdate(null)
      }
    })
  }

  const updateIndicator = (id: string, updates: Partial<Indicator>) => {
    update.mutate({ indicatorId: id, updates }, {
      onSuccess: () => {
        setIndicatorToUpdate(null)
      }
    })
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
          loading={loading}
        />
      )}
      <Flex gap="10px" alignItems="center">
        {indicators?.map((indicator) => (
          <Tag.Root key={indicator.id} variant="outline" colorPalette="yellow" className="mt-5" cursor="pointer">
            <Tag.StartElement>
              <GoGraph />
            </Tag.StartElement>
            <Tag.Label onClick={() => setIndicatorToUpdate(indicator)}>{indicator.content}</Tag.Label>
            <Tag.EndElement cursor="pointer">
              <Tag.CloseTrigger onClick={() => handleRemove(indicator.id)} />
            </Tag.EndElement>
          </Tag.Root>
        ))}
        <Button size="xs" variant="outline" className="mt-5" onClick={handleCreate} disabled={disableIndicator}>
          <SlPlus /> Add Indicator
        </Button>
        <SavingSpinner loading={loading} text={loadingText} />
      </Flex>
      {!canAdd && (
        <Alert.Root status="info" size="sm" variant="outline">
          <Alert.Indicator />
          <Alert.Title>
            You have reached the maximum number of indicators for this goal
          </Alert.Title>
        </Alert.Root>
      )}
    </Flex>
  )
}
