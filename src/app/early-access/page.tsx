'use client'

import { Button, Container, Heading, Text, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

export default function EarlyAccess() {
  const router = useRouter()

  return (
    <Container maxW="container.lg" centerContent py={16}>
      <VStack gap={6} textAlign="center">
        <Heading size="4xl">Welcome to the Early Access!</Heading>
        <Text fontSize="lg" color="gray.600">
          Thank you for being an early user. Your feedback helps shape the future of this app.
        </Text>
        <Button
          size="lg"
          variant="subtle"
          colorPalette="yellow"
          onClick={() => router.push('/plan/new')}
        >
          Get Started
        </Button>
      </VStack>
    </Container>
  )
}
