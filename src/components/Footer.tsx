'use client'
import { Box, Text } from '@chakra-ui/react'

export function Footer() {
  return (
    <footer>
      <Box paddingY="4" textAlign="center">
        <Text fontSize="sm">
          MC Code Studio Product © {new Date().getFullYear()}
        </Text>
      </Box>
    </footer>
  )
}
