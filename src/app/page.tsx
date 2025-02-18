'use client'
import { WaitListSection } from '@/components/WaitlistSection'
import { Button, Flex, Heading, Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { RiArrowRightLine } from 'react-icons/ri'

export default function Home() {
  const router = useRouter()

  return (
    <div className="container">
      <section className="page">
        <Heading as="h1" size="7xl">The Planner</Heading>
        <Flex flexDir="column" gap="1rem" alignItems="center">
          <Text>Stay Focused and Achieve More</Text>
          <Button size="xl" onClick={() => router.push('/#wait-list')} colorPalette="yellow" variant="subtle" width="100%">Get Started <RiArrowRightLine /></Button>
          {/* <Text fontSize="xs">Already have an account?</Text> */}
        </Flex>
        {/* <Button size="xs" onClick={() => router.push('/api/auth/login')} variant="plain" textDecoration="underline">Login</Button> */}
      </section>
      {/* <section className="page" id="description">
        <Heading size="5xl">Create Your Plan</Heading>
      </section> */}
      {/* <section className="page" id="pricing">
        Pricing... TBD
      </section> */}
      <section className="page" id="wait-list">
        <WaitListSection />
      </section>
    </div>
  )
}
