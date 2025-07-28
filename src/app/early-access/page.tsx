'use client'
import withToken, { WithTokenPageProps } from '@/app/hoc/withToken'
import { useWaitlistActions } from '@/app/hooks/useWaitlistActions'
import { useAccountContext } from '@/app/providers/useAccountContext'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { toaster } from '@/components/ui/toaster'
import { SyncService } from '@/services/sync'
import { Flex, Heading, Text, VStack } from '@chakra-ui/react'
import { Role } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { PiMailboxThin } from 'react-icons/pi'

function EarlyAccess(props: WithTokenPageProps) {
  const { waitlistData } = props
  const router = useRouter()
  const { userActions } = useAccountContext()
  const waitlistActions = useWaitlistActions()
  const create = userActions.useCreate()
  const update = waitlistActions.useUpdate()
  const loading = create.isPending || update.isPending
  const notInvited = !waitlistData?.invited
  const disabled = loading || notInvited

  const handleCreateUser = () => {
    const newUser = {
      role: Role.GUEST,
      email: waitlistData!.email,
      waitlistId: waitlistData!.id,
    }
    create.mutate(newUser, {
      onSuccess: () => {
        if (SyncService.isEnabled) {
          router.push('/join')
          return
        }
        router.replace('/new')
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

  if (notInvited) {
    return (
      <EmptyState
        icon={<PiMailboxThin />}
        title="Your Invitation is on the Way! 🎉"
        size="lg"
        description="You haven’t been invited yet, but don’t worry—it’s coming soon! Keep an eye on your inbox, and you’ll be able to join as soon as your invitation arrives."
      >
        <Flex gap="1rem" direction="column">
          <Button onClick={() => router.replace('/')}>Go to home</Button>
        </Flex>
      </EmptyState>
    )
  }

  return (
    <Flex maxW="container.lg" alignItems="center" justifyContent="center" height="calc(100% - 5rem)">
      <VStack gap={6} textAlign="center">
        <Heading size={{ lg: "4xl", base: "2xl" }}>Welcome to the Early Access!</Heading>
        <Text fontSize={{ lg: "lg", base: "md" }} color="gray.600">
          Thank you for being an early user. Your feedback helps shape the future of <strong>The Planner</strong>.
        </Text>
        <Button
          size="lg"
          variant="subtle"
          colorPalette="cyan"
          onClick={handleCreateUser}
          loading={loading}
          disabled={disabled}
        >
          Get Started
        </Button>
      </VStack>
    </Flex>
  )
}

export default withToken(EarlyAccess)
