import { Button, Grid, GridItem, Group } from '@chakra-ui/react';
import { StepsCompletedContent, StepsContent, StepsItem, StepsList, StepsNextTrigger, StepsPrevTrigger, StepsRoot } from '../../components/ui/steps';
import { Step1 } from './step1';

export default function Steps() {

  const steps = [
    { title: 'Define Vision', content: <Step1 /> },
    { title: '3-Year Milestone', content: 'Step 2' },
    { title: 'Set Goals', content: 'Step 3' },
    { title: 'Prioritize', content: 'Step 4' },
    { title: 'Focus on One', content: 'Step 5' },
    { title: 'Plan Actions & Metrics', content: 'Step 6' },
    // { title: 'Set Indicators', content: 'Step 7' },
    { title: 'Pick a Start Date', content: 'Step 7' },
  ];

  return (
    <StepsRoot key="subtle" variant="subtle" count={steps.length} height="calc(80vh - 2rem)" className="p-10">
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
            <StepsContent key={index} index={index} className="mt-10">
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
