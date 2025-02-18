'use client'
import withToken, { WithTokenPageProps } from '@/app/hoc/withToken'
import { useWaitlistActions } from '@/app/hooks/useWaitlistActions'
import { useAccountContext } from '@/app/providers/useAccountContext'
import { Button } from '@/components/ui/button'
import { toaster } from '@/components/ui/toaster'
import { Flex, Heading, Text, VStack } from '@chakra-ui/react'
import { Role } from '@prisma/client'
import { useRouter } from 'next/navigation'

function EarlyAccess(props: WithTokenPageProps) {
  const { waitlistData } = props
  const router = useRouter()
  const { userActions } = useAccountContext()
  const waitlistActions = useWaitlistActions()
  const create = userActions.useCreate()
  const update = waitlistActions.useUpdate()
  const loading = create.isPending || update.isPending

  const handleCreateUser = () => {
    const newUser = {
      role: Role.GUEST,
      email: waitlistData!.email,
      waitlistId: waitlistData!.id,
    }
    create.mutate(newUser, {
      onSuccess: () => {
        router.replace('/plan/new')
      },
      onError: (error) => {
        toaster.create({
          type: 'error',
          title: 'Error',
          description: error.message
        })
      },
    })
  }

  return (
    <Flex maxW="container.lg" alignItems="center" justifyContent="center" height="calc(100% - 5rem)">
      <VStack gap={6} textAlign="center">
        <Heading size="4xl">Welcome to the Early Access!</Heading>
        <Text fontSize="lg" color="gray.600">
          Thank you for being an early user. Your feedback helps shape the future of this app.
        </Text>
        <Button
          size="lg"
          variant="subtle"
          colorPalette="yellow"
          onClick={handleCreateUser}
          loading={loading}
          disabled={loading}
        >
          Get Started
        </Button>
      </VStack>
    </Flex>
  )
}

export default withToken(EarlyAccess)
