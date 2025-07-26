'use client'
import { Box, Text } from '@chakra-ui/react'

export function Footer() {
  return (
    <Box as="footer" width="100%" bg="gray.200" paddingY="4" paddingX="8" textAlign="center">
      <Text fontSize="sm" color="gray.700">
        MC Code Studio © {new Date().getFullYear()}
      </Text>
    </Box>
  )
}
