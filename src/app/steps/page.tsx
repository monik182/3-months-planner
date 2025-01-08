'use client'
import { Button, Grid, GridItem, Group } from '@chakra-ui/react'
import { StepsCompletedContent, StepsContent, StepsItem, StepsList, StepsNextTrigger, StepsPrevTrigger, StepsRoot } from '@/components/ui/steps'
import { Step1 } from './Step1'
import { Step2 } from './Step2'
import { Step3 } from './Step3/Step3'
import { useEffect, useState } from 'react'
import { Step4 } from './Step4/Step4'
import { Goal, Plan, Vision } from '@/types'
import { useProtectedPage } from '../hooks/useProtectedPage'
import { useDebouncedCallback } from 'use-debounce'
import { PlanService } from '../../services/plan'
import { createPlan } from '../factories'

async function fetchPlan(userId: string) {
  const plan = await PlanService.getByUserId(userId)
  console.log('FRESHLY FETCHED PLAN FROM REMOTE<<<>>>>', plan)
  return plan
}

export default function Steps() {
  const { user } = useProtectedPage()
  const [plan, setPlan] = useState<Plan>()

  const handleCreatePlan = async () => {
    if (!user?.sub) return
    const newPLan = createPlan(user?.sub)
    const createdPlan = await PlanService.create(newPLan)
    console.log('Created pkan>>>>', createdPlan)
  }

  const debouncedHandleStep1Change = useDebouncedCallback(
    (value: Vision) => {
      setPlan(plan => {
        if (!plan) return plan
        return { ...plan, vision: value.content }
      })
      console.log('debounced', value)
    }, 1000)
    

  const debouncedHandleStep2Change = useDebouncedCallback(
    (value: Vision) => {
      setPlan(plan => {
        if (!plan) return plan
        return { ...plan, threeYearMilestone: value.content }
      })
    }, 1000)

    const debouncedHandleStep3Change = useDebouncedCallback(
      (value: Goal[]) => {
        setPlan(plan => {
          if (!plan) return plan
          return { ...plan, goals: value }
        })
      }, 1000)

  const debouncedHandleStep4Change = useDebouncedCallback(
    (value: Plan) => {
      setPlan(plan => {
        if (!plan) return plan
        return { ...plan, ...value }
      })
    }, 1000)

    useEffect(() => {
      if (user?.sub) {
        fetchPlan(user.sub)
      }
    }, [user?.sub])

  if (!user) {
    return null
  }

  const steps = [
    { title: 'Define Vision', content: <Step1 goNext={() => console} onChange={debouncedHandleStep1Change} /> },
    { title: '3-Year Milestone', content: <Step2 onChange={debouncedHandleStep2Change} /> },
    { title: 'Set Goals, Actions & Metrics', content: <Step3 onChange={debouncedHandleStep3Change} /> },
    { title: 'Start Date & Review', content: <Step4 plan={plan!} onChange={debouncedHandleStep4Change} /> },
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
              <Button onClick={handleCreatePlan}>CREATE PLAN</Button>
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
