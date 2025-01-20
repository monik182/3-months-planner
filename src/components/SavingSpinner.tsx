import { Flex, Spinner } from '@chakra-ui/react';

interface SavingSpinnerProps {
  loading: boolean
}

export function SavingSpinner({ loading }: SavingSpinnerProps) {
  if (!loading) return null

  return (
    <Flex gap="1rem" height="1rem" justifyContent="flex-end" alignItems="center">
      <><Spinner size="xs" /> Saving</>
    </Flex>
  )
}
