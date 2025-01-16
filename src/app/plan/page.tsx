'use client'
import { Button, Grid, GridItem, Group, Spinner } from '@chakra-ui/react'
import { StepsCompletedContent, StepsContent, StepsItem, StepsList, StepsNextTrigger, StepsPrevTrigger, StepsRoot } from '@/components/ui/steps'
import { Step1 } from './Step1'
import { Step2 } from './Step2'
import { Step3 } from './Step3/Step3'
import { Step4 } from './Step4/Step4'
import { usePlanContext } from '@/app/providers/usePlanContext'
import { useState } from 'react'
import { useSave } from '@/app/plan/useSave'
import { useRouter } from 'next/navigation'
import { toaster } from '@/components/ui/toaster'

export default function PlanPage() {
  const router = useRouter()
  const { plan, planActions, goalActions, strategyActions, indicatorActions } = usePlanContext()
  const [nextText, setNextText] = useState('Next')
  const [step, setStep] = useState(0)
  const { handleSavePlan, isLoading } = useSave()
  console.log('cyrrent polan plage>>>>', plan)

  if (!plan) {
    router.replace('/plan/new')
    return null
  }

  const steps = [
    { title: 'Define Vision', content: <Step1 goNext={() => console} /> },
    // { title: '3-Year Milestone', content: <Step2 /> },
    // { title: 'Set Goals, Actions & Metrics', content: <Step3 /> },
    // { title: 'Start Date & Review', content: <Step4 /> },
  ]

  const handleStepChange = async ({ step }: { step: number }) => {
    console.log('NEXT STEP>>>>', step)

    if (step === 1 && !plan.vision) {
      setStep(0)
      toaster.create({
        title: 'Create your vision to move to the next step',
        type: 'info',
      })
      return
    }

    if (step === 2 && !plan.milestone) {
      setStep(0)
      toaster.create({
        title: 'Create your 3-year milestone to move to the next step',
        type: 'info',
      })
      return
    }

    if (step === 3) {
      setNextText('Save')
    } else if (step > 3) {
      try {
        const plan = await handleSavePlan()
        if (!plan) {
          setStep(3)
          return
        }
        setNextText('Saved')
        router.replace('/dashboard')
      } catch {
        setStep(3)
        return
      }
    } else {
      setNextText('Next')
    }
    setStep(step)
  }

  return (
    <StepsRoot linear variant="subtle" step={step} count={steps.length} height="calc(80vh - 2rem)" padding="1rem 2rem" onStepChange={handleStepChange} onStepComplete={() => console.log('complrted step tp',)}>
      <Grid gridTemplateRows="10% 90% 10%" height="100%" gap="1rem">
        <GridItem>
          <StepsList>
            {steps.map((step, index) => (
              <StepsItem key={index} index={index} title={step.title} />
            ))}
          </StepsList>
        </GridItem>
        <GridItem>

          {steps.map((step, index) => (
            <StepsContent key={index} index={index} className="h-full">
              {step.content}
            </StepsContent>
          ))}
          <StepsCompletedContent>
            Congrats, you have created your 3-month plan!
          </StepsCompletedContent>
        </GridItem>
        <GridItem>
          <Group>
            <StepsPrevTrigger asChild>
              <Button variant="outline" size="sm">
                Prev
              </Button>
            </StepsPrevTrigger>
            <StepsNextTrigger asChild>
              <Button variant="outline" size="sm" disabled={isLoading}>
                {isLoading ?
                  <Spinner />
                  :
                  nextText
                }
              </Button>
            </StepsNextTrigger>
          </Group>
        </GridItem>
      </Grid>
    </StepsRoot>
  )
}
