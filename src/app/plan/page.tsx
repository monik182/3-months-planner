'use client'
import { Button, Grid, GridItem, Group } from '@chakra-ui/react'
import { StepsCompletedContent, StepsContent, StepsItem, StepsList, StepsNextTrigger, StepsPrevTrigger, StepsRoot } from '@/components/ui/steps'
import { Step1 } from './Step1'
import { Step2 } from './Step2'
import { Step3 } from './Step3/Step3'
import { Step4 } from './Step4/Step4'
import { useProtectedPage } from '@/app/hooks/useProtectedPage'
import { PlanProvider, usePlanContext } from '@/app/providers/usePlanContext'

function PlanPage() {
  const { user } = useProtectedPage()
  const { plan } = usePlanContext()

  if (!user) {
    return null
  }

  const steps = [
    { title: 'Define Vision', content: <Step1 goNext={() => console} /> },
    { title: '3-Year Milestone', content: <Step2 /> },
    { title: 'Set Goals, Actions & Metrics', content: <Step3 /> },
    // { title: 'Start Date & Review', content: <Step4 /> },
  ]

  return (
    <StepsRoot linear step={2} variant="subtle" count={steps.length} height="calc(80vh - 2rem)" padding="1rem 2rem" onStepChange={(details) => console.log('chaging step tp', details)} onStepComplete={() => console.log('complrted step tp',)}>
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
                Next
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
