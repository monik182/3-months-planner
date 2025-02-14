import { Flex, Textarea } from '@chakra-ui/react'
import { StepLayout } from './stepLayout'
import { Step, Vision } from '@/app/types/types'
import { useEffect, useState } from 'react'
import { usePlanContext } from '@/app/providers/usePlanContext'
import { useDebouncedCallback } from 'use-debounce'
import { SavingSpinner } from '@/components/SavingSpinner'

export function Step2({ onLoading }: Step<Vision>) {
  const { plan, planActions } = usePlanContext()
  const [value, setValue] = useState(plan?.milestone ?? '')
  const update = planActions.useUpdate()

  const debounced = useDebouncedCallback(
    (milestone: string) => {
      update.mutate({ planId: plan!.id, updates: { milestone } })
    }, 1000)

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const milestone = e.target.value
    setValue(milestone)
    debounced(milestone)
  }

  useEffect(() => {
    onLoading?.(update.isPending)
  }, [update.isPending])

  return (
    <StepLayout
      title="Define your 3-Year Milestone"
      description="Your 3-year milestone is your compass. Picture yourself three years from today—what accomplishments will make you proud and show you're on track for your ultimate vision? Be ambitious, but grounded. Identify what will make the biggest impact on your life, career, and growth in this transformative period. Dream big, act bold, and build momentum."
    >
      <Flex direction="column" gap="1rem">
        <Textarea
          autoresize
          size="xl"
          variant="outline"
          value={value}
          onChange={handleOnChange}
          placeholder="Where do you want to be in 3 years? What key achievements, progress, or changes will set the stage for your long-term vision? Think of this as the bridge between where you are now and where you're going."
        />
        <SavingSpinner loading={update.isPending} />
      </Flex>
    </StepLayout>
  )
}
