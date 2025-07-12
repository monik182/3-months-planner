'use client'
import { useAccountContext } from '@/app/providers/useAccountContext'
import { WaitListSection } from '@/components/WaitlistSection'
import { Button, Flex, Heading, Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { RiArrowRightLine } from 'react-icons/ri'

export default function Home() {
  const router = useRouter()
  const { user } = useAccountContext()

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  })

  return (
    <div className="container">
      <section className="page" id="get-started">
        <Heading as="h1" size={{ lg: "7xl", base: "4xl" }}>The Planner</Heading>
        <Flex flexDir="column" gap="1rem" alignItems="center">
          <Text>Stay Focused and Achieve More</Text>
          <Button size="xl" onClick={() => router.push('/signup')} colorPalette="yellow" variant="subtle" width="100%">Get Started <RiArrowRightLine /></Button>
          <Text fontSize="xs">Already have an account?</Text>
        </Flex>
        <Button size="xs" onClick={() => router.push('/login')} variant="plain" textDecoration="underline">Login</Button>
      </section>
      {/* <section className="page" id="description">
        <Heading size="5xl">Create Your Plan</Heading>
      </section> */}
      {/* <section className="page" id="pricing">
        Pricing... TBD
      </section> */}
      {/* <section className="page" id="wait-list">
        <WaitListSection />
      </section> */}
    </div>
  )
}
