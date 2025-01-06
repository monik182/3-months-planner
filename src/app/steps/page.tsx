'use client'
import { Button, Grid, GridItem, Group } from '@chakra-ui/react'
import { StepsCompletedContent, StepsContent, StepsItem, StepsList, StepsNextTrigger, StepsPrevTrigger, StepsRoot } from '@/components/ui/steps'
import { Step1 } from './Step1'
import { Step2 } from './Step2'
import { Step3 } from './Step3/Step3'
import { useEffect, useState } from 'react'
import { Step4 } from './Step4/page'
import { Goal, Plan, Vision } from '@/types'
import { INITIAL_PLAN } from '@/constants'
import { v4 as uuidv4 } from 'uuid'

export default function Steps() {
  const [isClient, setIsClient] = useState(false)
  const [plan, setPlan] = useState<Plan>({ ...INITIAL_PLAN, id: uuidv4() })

  const handleStep1Change = (value: Vision) => {
    setPlan(plan => ({ ...plan, vision: value.content }))
  }

  const handleStep2Change = (value: Vision) => {
    setPlan(plan => ({ ...plan, threeYearMilestone: value.content }))
  }

  const handleStep3Change = (value: Goal[]) => {
    setPlan(plan => ({ ...plan, goals: value }))
  }

  const handleStep4Change = (value: Plan) => {
    setPlan(plan => ({ ...plan, ...value }))
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  const steps = [
    { title: 'Define Vision', content: <Step1 goNext={() => console} onChange={handleStep1Change} /> },
    { title: '3-Year Milestone', content: <Step2 onChange={handleStep2Change} /> },
    { title: 'Set Goals, Actions & Metrics', content: <Step3 onChange={handleStep3Change} /> },
    { title: 'Start Date & Review', content: <Step4 plan={plan} onChange={handleStep4Change} /> },
  ]

  return (
    <StepsRoot linear variant="subtle" count={steps.length} height="calc(80vh - 2rem)" padding="1rem 2rem" onStepChange={(details) => console.log('chaging step tp', details)} onStepComplete={() => console.log('complrted step tp',)}>
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
            Congrats, you have created your 3-months plan!
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
