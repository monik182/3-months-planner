'use client'
import { Button, Flex, Heading, Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { RiArrowRightLine } from 'react-icons/ri'
import Image from 'next/image'

export default function Home() {
  const router = useRouter()

  return (
    <div className="container">
      <section className="page" id="get-started">
        <Heading as="h1" size={{ lg: "7xl", base: "4xl" }} display="flex" alignItems="center" gap="2" flexDirection={{ base: "column" }}>
          <Image src="/logo-icon-no-bg.png" alt="The Planner" width="100" height="100" />
          The Planner
        </Heading>
        <Flex flexDir="column" gap="1rem" alignItems="center">
          <Text>Stay Focused and Achieve More</Text>
          <Button size="xl" onClick={() => router.push('/join')} colorPalette="yellow" variant="subtle" width="100%">Get Started <RiArrowRightLine /></Button>
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
