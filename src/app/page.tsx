'use client'
import { usePlanContext } from '@/app/providers/usePlanContext'
import { useUser } from '@auth0/nextjs-auth0/client'
import { Button, Flex, Heading, Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { RiArrowRightLine } from 'react-icons/ri'

export default function Home() {
  const { user } = useUser()
  const { hasPlan } = usePlanContext()
  const router = useRouter()

  if (hasPlan) {
    router.push('/dashboard')
  }

  if (!!user && !hasPlan) {
    router.push('/plan')
  }

  return (
    <Flex justifyContent="center" alignItems="center" height="calc(100vh - 10rem)" flexDir="column" gap="1rem">
      <Heading size="7xl">The Planner</Heading>
      <Text>Plan your life, achieve your dreams.</Text>
      <Button size="xl" onClick={() => router.push('/api/auth/login')} colorPalette="cyan" variant="subtle">Get Started <RiArrowRightLine /></Button>
    </Flex>
  )
}
