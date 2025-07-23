'use client'
import { Box, Text } from '@chakra-ui/react'

export function Footer() {
  return (
    <footer>
      <Box paddingY="4" textAlign="center" bg="gray.200">
        <Text fontSize="sm" color="gray.700">
          MC Code Studio Product © {new Date().getFullYear()}
        </Text>
      </Box>
    </footer>
  )
}
