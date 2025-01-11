import { Textarea } from '@chakra-ui/react'
import { StepLayout } from './step-layout'
import { Step, Vision } from '@/types'
import { useState } from 'react'
import { usePlanContext } from '../providers/usePlanContext'
import { useDebouncedCallback } from 'use-debounce'

export function Step1({ goNext }: Step<Vision>) {
  const { plan, updatePlan } = usePlanContext()
  const [value, setValue] = useState(plan.vision)

  const debounced = useDebouncedCallback(
    (vision: string) => {
      updatePlan({ vision })
    }, 1000)

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const vision = e.target.value
    setValue(vision)
    debounced(vision)
  }

  return (
    <StepLayout
      title="Define your long term vision"
      description="Dare to dream without limits. Picture a future where you've achieved everything you’ve ever desired. Be bold and dream unapologetically—this is your life, your vision, your legacy. What passions have you followed fearlessly? What does fulfillment look like in your career, relationships, and personal growth? Envision a life where every choice you make aligns with your deepest values and aspirations. Let your imagination run free, embrace your wildest ambitions, and create a vision that excites and motivates you every day. Dream as if failure isn’t an option, and let your boldness pave the way."
    >
      <Textarea
        autoresize
        size="xl"
        variant="outline"
        value={value}
        onChange={handleOnChange}
        placeholder="Think big. What are the dreams you’ve always wanted to pursue? How would your life look if you reached your full potential? Be bold and dream unapologetically."
      />
    </StepLayout>
  )
}
