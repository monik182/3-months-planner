import { Flex, Progress, Text, VStack } from '@chakra-ui/react';

export interface WeekProgressIndicatorProps {
  completionPercentage: number
}

export default function WeekProgressIndicator({
  completionPercentage,
}: WeekProgressIndicatorProps) {

  return (
    <VStack gap={1} align="stretch">
      <Flex justify="space-between" fontSize="sm">
        <Text fontWeight="medium">{completionPercentage}% complete</Text>
      </Flex>
      <Progress.Root value={completionPercentage} height={2} borderRadius="sm">
        <Progress.Track>
          <Progress.Range />
        </Progress.Track>
      </Progress.Root>
    </VStack>
  )
}

