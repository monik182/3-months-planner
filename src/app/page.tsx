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
    <div className="container">
      <section className="page page1">
        <Heading size="7xl">The Planner</Heading>
        <Flex flexDir="column" gap="1rem" alignItems="center">
          <Text>Plan your life, achieve your dreams.</Text>
          <Button size="xl" onClick={() => router.push('/#pricing')} colorPalette="cyan" variant="subtle" width="100%">Get Started <RiArrowRightLine /></Button>
          <Text fontSize="xs">Already have an account?</Text>
        </Flex>
        <Button size="xs" onClick={() => router.push('/api/auth/login')} variant="plain" textDecoration="underline">Login</Button>
      </section>
      <section className="page page2" id="pricing">Pricing Page</section>
      <section className="page page3">Wait List Page</section>
    </div>
  )
}
