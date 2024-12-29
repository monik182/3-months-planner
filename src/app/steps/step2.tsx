import { Textarea } from '@chakra-ui/react';
import { StepLayout } from './step-layout';

export function Step2() {
  return (
    <StepLayout
      title="Define your 3-Year Milestone"
      description="Your 3-year milestone is your compass. Picture yourself three years from today—what accomplishments will make you proud and show you're on track for your ultimate vision? Be ambitious, but grounded. Identify what will make the biggest impact on your life, career, and growth in this transformative period. Dream big, act bold, and build momentum."
    >
      <Textarea
        size="xl"
        variant="outline"
        className="mt-5"
        placeholder="Where do you want to be in 3 years? What key achievements, progress, or changes will set the stage for your long-term vision? Think of this as the bridge between where you are now and where you're going."
      />
    </StepLayout>
  )
}
