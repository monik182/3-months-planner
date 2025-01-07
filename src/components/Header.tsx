'use client'
import { Flex, HStack, Heading, Separator } from '@chakra-ui/react'
import { ColorModeButton } from './ui/color-mode'
import { SegmentedControl } from './ui/segmented-control'
import { SlHome, SlNotebook } from 'react-icons/sl'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@auth0/nextjs-auth0/client'


const pageMap: Record<string, string> = {
  home: '/dashboard',
  planner: '/steps',
}

export function Header() {
  const { user, error, isLoading } = useUser()

  const [value, setValue] = useState('home')
  const router = useRouter()
  const handleOnChange = (value: string) => {
    setValue(value)
    router.push(pageMap[value])
  }

  const items = [
    {
      value: "home",
      label: (
        <HStack>
          <SlHome />
          Home
        </HStack>
      ),
    },
    {
      value: "planner",
      label: (
        <HStack>
          <SlNotebook />
          Planner
        </HStack>
      ),
    },
  ]

  return (
    <header>
      <Flex justify="space-between" align="center" marginTop="1rem">
        <Flex gap="1rem" align="center">
          <Heading size="2xl">3-Months Planner</Heading>
          <SegmentedControl
            size="lg"
            value={value}
            onValueChange={(e) => handleOnChange(e.value)}
            items={items}
          />
        </Flex>
        <Flex gap="5px" align="center">
          {user ? (
            <a href="/api/auth/logout">Logout</a>
          ) : (
            <a href="/api/auth/login">Login</a>
          )}
          <ColorModeButton />
        </Flex>
      </Flex>
      <Separator margin="1rem 0" />
    </header>
  )
}
