import { usePlanContext } from '@/app/providers/usePlanContext'
import { IndicatorForm } from './IndicatorForm'
import { Button, Alert, Tag } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Indicator } from '@prisma/client'
import cuid from 'cuid'
import { SavingSpinner } from '@/components/SavingSpinner'
import { useDebouncedCallback } from 'use-debounce'
import { EntityType, Status } from '@/app/types/types'
import { AiOutlineBarChart } from 'react-icons/ai'
import { GoPlus } from 'react-icons/go'

interface IndicatorListProps {
  goalId: string
  planId: string
  maxLimit?: number
  onEdit?: (entityType: EntityType, entity: any) => void
  onLoading?: (loading: boolean) => void
}

export function IndicatorList({ goalId, planId, maxLimit, onEdit, onLoading }: IndicatorListProps) {
  const { indicatorActions } = usePlanContext()
  const { data: indicators = [] } = indicatorActions.useGetByGoalId(goalId)
  const [indicatorToUpdate, setIndicatorToUpdate] = useState<Indicator | null>()

  const create = indicatorActions.useCreate()
  const update = indicatorActions.useUpdate()
  const remove = indicatorActions.useDelete()

  const loadingText = create.isPending ? 'Creating' : 'Saving'
  const loading = create.isPending || update.isPending || remove.isPending
  const canAdd = maxLimit ? indicators.length < maxLimit : true
  const disableIndicator = !canAdd || !!indicators.some((indicator) =>
    indicator.initialValue == null ||
    indicator.goalValue == null ||
    !indicator.metric ||
    !indicator.content
  )
  const isEdit = !!indicators.find(i => i.id === indicatorToUpdate?.id)

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
      createdAt: null,
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
    if (isEdit) {
      setIndicatorToUpdate(null)
      return
    }
    const indicatorExists = !!indicators.find(i => i.id === id)
    if (indicatorExists) {
      debouncedRemove(id)
    }
  }

  const saveIndicator = (indicator: Indicator) => {
    create.mutate(indicator, {
      onSuccess: (newIndicator) => {
        setIndicatorToUpdate(null)
        onEdit?.(EntityType.Indicator, newIndicator)
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
    <div className="space-y-3">
      {!!indicatorToUpdate && (
        <div className="border border-gray-200 rounded-md bg-gray-50 mt-3">
          <IndicatorForm
            indicator={indicatorToUpdate}
            onChange={(indicator) => handleChange(indicatorToUpdate.id, indicator)}
            onRemove={() => handleRemove(indicatorToUpdate.id)}
            loading={loading}
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2 items-center">
        {indicators?.map((indicator) => (
          <Tag.Root
            key={indicator.id}
            variant="outline"
            colorPalette="gray"
            className="cursor-pointer hover:bg-gray-50"
          >
            <Tag.StartElement>
              <AiOutlineBarChart size={14} />
            </Tag.StartElement>
            <Tag.Label
              onClick={() => setIndicatorToUpdate(indicator)}
              className="text-xs"
            >
              {indicator.content}
            </Tag.Label>
            <Tag.EndElement>
              <Tag.CloseTrigger
                onClick={() => handleRemove(indicator.id)}
                className="text-gray-400 hover:text-gray-600"
                cursor="pointer"
              />
            </Tag.EndElement>
          </Tag.Root>
        ))}

        <Button
          size="xs"
          variant="outline"
          onClick={handleCreate}
          disabled={disableIndicator || loading}
          className="text-xs"
        >
          <GoPlus size={14} className="mr-1" />
          Add Indicator
        </Button>

        <SavingSpinner loading={loading} text={loadingText} />
      </div>

      {!canAdd && (
        <Alert.Root status="info" size="sm" variant="outline">
          <Alert.Indicator />
          <Alert.Title className="text-xs">
            Maximum {maxLimit} indicators per goal
          </Alert.Title>
        </Alert.Root>
      )}
    </div>
  )
}
