'use client'
import { Box, Heading, Stack, Text } from '@chakra-ui/react'

export default function PricingPage() {
  return (
    <Box textAlign="center" py={10}>
      <Heading size="2xl" mb={6}>Pricing</Heading>
      <Stack spacing={8} maxW="600px" mx="auto">
        <Box>
          <Heading size="lg">Free</Heading>
          <Text>Plan your goals with our basic tools.</Text>
        </Box>
        <Box>
          <Heading size="lg">$1 per Month</Heading>
          <Text>Unlock cloud sync and priority support.</Text>
        </Box>
        <Box>
          <Heading size="lg">$10 per Year</Heading>
          <Text>Get two months free when paying yearly.</Text>
        </Box>
      </Stack>
    </Box>
  )
}
