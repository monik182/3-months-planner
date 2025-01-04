import { useState } from 'react'
import { StepLayout } from '../step-layout'
import { Plan, Step } from '@/types'
import dayjs from 'dayjs'
import { DateSelector } from './DateSelector'
import { calculateEndDate } from '@/util'
import { Fieldset, Grid, Input } from '@chakra-ui/react'
import { Field } from '../../../components/ui/field'

export function Step4({ plan, goNext, onChange }: Step<Plan> & { plan: Plan }) {
  const [value, setValue] = useState<Plan>(plan)

  const handleDateChange = (value: string) => {
    const endDate = calculateEndDate(value)
    setValue((prev) => {
      const updatedPlan = { ...prev, startDate: value, endDate }
      onChange(updatedPlan)
      return updatedPlan
    })
  }

  return (
    <StepLayout
      title="Set a Start Date & Reflect"
      description="Choose the start date for your plan, marking the beginning of your journey toward achieving your goals. This is also a chance to review everything you’ve outlined so far—your vision, goals, and strategies—and ensure they align with your priorities and timeline. Take a moment to reflect and adjust if needed before you commit to taking the first step."
    >
      <Grid gap="1rem" templateColumns="1fr 1fr">
        <DateSelector onChange={handleDateChange} date={value.startDate} />
        <Fieldset.Root size="lg" disabled>
          <Field label="End Date">
            <Input disabled value={dayjs(value.endDate).format('MMMM DD, YYYY')} />
          </Field>
        </Fieldset.Root>
      </Grid>
    </StepLayout>
  )
}
