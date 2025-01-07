'use client'
import { Flex, HStack, Heading, Separator, Text } from '@chakra-ui/react'
import { ColorModeButton } from './ui/color-mode'
import { SegmentedControl } from './ui/segmented-control'
import { SlHome, SlLogout, SlNotebook } from 'react-icons/sl'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@auth0/nextjs-auth0/client'
import { Avatar } from './ui/avatar'
import { RxDashboard } from 'react-icons/rx'

const pageMap: Record<string, string> = {
  home: '/',
  dashboard: '/dashboard',
  planner: '/steps',
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
    hide: false,
  },
  {
    value: "dashboard",
    label: (
      <HStack>
        <RxDashboard />
        Dashboard
      </HStack>
    ),
    hide: true,
  },
  {
    value: "planner",
    label: (
      <HStack>
        <SlNotebook />
        Planner
      </HStack>
    ),
    hide: true,
  },
]

export function Header() {
  const { user } = useUser()
  const [value, setValue] = useState('home')
  const router = useRouter()
  const filteredItems = items.map((item) => ({ ...item, hide: item.value === 'home' ? false : !user })).filter((item) => !item.hide)

  const handleOnChange = (value: string) => {
    setValue(value)
    router.push(pageMap[value])
  }

  return (
    <header>
      <Flex justify="space-between" align="center" marginTop="1rem">
        <Flex gap="1rem" align="center">
          <Heading size="2xl" onClick={() => handleOnChange('home')}>
            3-Month Planner
          </Heading>
          <SegmentedControl
            size="lg"
            value={value}
            onValueChange={(e) => handleOnChange(e.value)}
            items={filteredItems}
          />
        </Flex>
        <Flex gap="5px" alignItems="center">
          {user ? (
            <Flex gap="1rem" alignItems="center">
              <Avatar
                name={user?.name || 'User'}
                src={user?.picture || ''}
                shape="full"
                size="lg"
              />
              <a href="/api/auth/logout" className="flex flex-col justify-center items-center gap-2"><SlLogout /> <Text textStyle="xs">Logout</Text></a>
            </Flex>
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
