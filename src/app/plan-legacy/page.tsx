'use client'
import { Button, Center, Flex, Grid, GridItem, Group, Spinner } from '@chakra-ui/react'
import { StepsCompletedContent, StepsContent, StepsItem, StepsList, StepsNextTrigger, StepsPrevTrigger, StepsRoot } from '@/components/ui/steps'
import { Step1 } from './Step1'
import { Step3 } from './Step3/Step3'
import { Step4 } from './Step4/Step4'
import { usePlanContext } from '@/app/providers/usePlanContext'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toaster } from '@/components/ui/toaster'
import { useHistoryActions } from '@/app/hooks/useHistoryActions'
import { EmptyState } from '@/components/ui/empty-state'
import { MdOutlineCelebration } from 'react-icons/md'

function PlanPage() {
  const router = useRouter()
  const { plan, planActions } = usePlanContext()
  const [nextText, setNextText] = useState('Next')
  const [isLoadingStep, setIsLoadingStep] = useState(false)
  const [step, setStep] = useState(0)
  const createHistory = useHistoryActions().useCreate()
  const updatePlan = planActions.useUpdate()
  const loading = updatePlan.isPending || createHistory.isPending

  const steps = [
    { title: 'Define Vision', content: <Step1 onLoading={setIsLoadingStep} /> },
    { title: 'Set Goals, Actions & Metrics', content: <Step3 onLoading={setIsLoadingStep} /> },
    { title: 'Review', content: <Step4 /> },
  ]

  const handleStepChange = async ({ step }: { step: number }) => {
    if (!plan) return

    if (step === 1 && !plan.vision) {
      setStep(0)
      toaster.create({
        title: 'Create your vision to move to the next step',
        type: 'info',
      })
      return
    }


    if (step === 2) {
      setNextText('Save')
    } else if (step > 2) {
      await createHistory.mutateAsync(plan.id, {
        onSuccess: () => {
          setNextText('Saved')
          updatePlan.mutate({ planId: plan.id, updates: { started: true } }, {
            onSuccess: () => {
              router.replace('/dashboard')
            },
            onError: () => {
              setStep(2)
              toaster.create({
                title: 'There was an error saving the plan',
                type: 'error'
              })
            }
          })
        },
        onError: () => {
          setStep(2)
          toaster.create({
            title: 'There was an error saving the plan',
            type: 'error'
          })
        }
      })
    } else {
      setNextText('Next')
    }
    setStep(step)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [step])

  if (!plan) return null

  return (
    <StepsRoot 
      linear 
      size={{ base: "xs", lg: "lg" }}
      orientation={{ base: "vertical", lg: "horizontal" }} 
      variant="subtle" step={step} count={steps.length} height="80vh" padding={{ base: "1rem 0", lg: "1rem 2rem" }} onStepChange={handleStepChange}>
      <Grid gridTemplateRows={{ base: "5% 80% 15%", lg:"10% 80% 10%" }} height="100%" gap="1rem">
        <GridItem>
          <StepsList>
            {steps.filter((_, index) => index === step).map((step, index) => (
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
            <Center>
              <EmptyState
                icon={<MdOutlineCelebration />}
                title="Congrats!"
                size={{ base: "sm", lg: "lg" }}
                description="You have created your plan!"
              >
                <Flex gap="1rem" direction="column">
                  <Button onClick={() => router.replace('/dashboard')}>Go to dashboard</Button>
                </Flex>
              </EmptyState>
            </Center>
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
              <Button variant="outline" size="sm" disabled={loading || isLoadingStep}>
                {loading ?
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

export default PlanPage
