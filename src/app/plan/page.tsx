'use client'
import { Button, Grid, GridItem, Group } from '@chakra-ui/react'
import { StepsCompletedContent, StepsContent, StepsItem, StepsList, StepsNextTrigger, StepsPrevTrigger, StepsRoot } from '@/components/ui/steps'
import { Step1 } from './Step1'
import { Step2 } from './Step2'
import { Step3 } from './Step3/Step3'
import { Step4 } from './Step4/Step4'
import { PlanProvider } from '@/app/providers/usePlanContext'
import { useState } from 'react'
import { useSave } from '@/app/plan/useSave'

function PlanPage() {
  const [nextText, setNextText] = useState('Next')
  const [step, setStep] = useState(0)
  const { handleSavePlan } = useSave()

  const steps = [
    { title: 'Define Vision', content: <Step1 goNext={() => console} /> },
    { title: '3-Year Milestone', content: <Step2 /> },
    { title: 'Set Goals, Actions & Metrics', content: <Step3 /> },
    { title: 'Start Date & Review', content: <Step4 /> },
  ]

  const handleStepChange = ({ step }: { step: number }) => {
    console.log('NEXT STEP>>>>', step)
    if (step === 3) {
      setNextText('Save')
    } else if (step > 3) {
      setNextText('Saved')
      handleSavePlan()
      console.log('show saved message and redirect to dashboard!!!')

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
              <Button variant="outline" size="sm">
                {nextText}
              </Button>
            </StepsNextTrigger>
          </Group>
        </GridItem>
      </Grid>
    </StepsRoot>
  )
}

export default function PlanWithProvider() {
  return (
    <PlanProvider>
      <PlanPage />
    </PlanProvider>
  )
}
