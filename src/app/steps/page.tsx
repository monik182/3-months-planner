import { Button, Grid, GridItem, Group } from '@chakra-ui/react';
import { StepsCompletedContent, StepsContent, StepsItem, StepsList, StepsNextTrigger, StepsPrevTrigger, StepsRoot } from '@/components/ui/steps';
import { Step1 } from './step1';
import { Step2 } from './step2';
import { Step3 } from './step3';

export default function Steps() {

  const steps = [
    { title: 'Define Vision', content: <Step1 /> },
    { title: '3-Year Milestone', content: <Step2 /> },
    { title: 'Set Goals', content: <Step3 /> },
    { title: 'Plan Actions & Metrics', content: 'Step 6' },
    { title: 'Pick a Start Date', content: 'Step 7' },
  ]

  return (
    <StepsRoot key="subtle" variant="subtle" count={steps.length} height="calc(80vh - 2rem)" padding="1rem 2rem">
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
