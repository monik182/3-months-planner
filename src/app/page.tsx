'use client'
import { Box, Button, Flex, Heading, Stack, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AnimatedCounter } from '@/components/AnimatedCounter'

export default function Home() {
  const [stats, setStats] = useState({ waitlist: 0, users: 0 })

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {})
  }, [])

  return (
    <Stack spacing={20} py={10}>
      <Box textAlign="center">
        <Heading size={{ lg: '7xl', base: '4xl' }} mb={4}>
          The Planner
        </Heading>
        <Text fontSize="xl" mb={6}>
          Stay focused and achieve more with a simple 12‑week planning tool.
        </Text>
        <Button
          as={Link}
          href="/signup"
          colorPalette="yellow"
          variant="subtle"
          size="xl"
        >
          Get Started
        </Button>
      </Box>
      <Flex justify="center" gap={10}>
        <AnimatedCounter label="On the Waitlist" value={stats.waitlist} />
        <AnimatedCounter label="Active Users" value={stats.users} />
      </Flex>
      <Box textAlign="center">
        <Heading size="xl" mb={4}>
          Why The Planner?
        </Heading>
        <Stack spacing={2}>
          <Text>Simplicity over cluttered tools.</Text>
          <Text>Keep your goals organized.</Text>
          <Text>Track progress every week.</Text>
        </Stack>
      </Box>
      <Box textAlign="center">
        <Heading size="xl" mb={4}>
          Pricing
        </Heading>
        <Text mb={4}>Free or just $1 a month (or $10 a year).</Text>
        <Button as={Link} href="/pricing" variant="outline" size="lg">
          Learn More
        </Button>
      </Box>
    </Stack>
  )
}
