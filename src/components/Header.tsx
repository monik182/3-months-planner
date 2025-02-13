'use client'
import { Flex, HStack, Heading, Separator, Text } from '@chakra-ui/react'
import { ColorModeButton } from './ui/color-mode'
import { SlLogin, SlLogout, SlNotebook } from 'react-icons/sl'
import { usePathname, useRouter } from 'next/navigation'
import { useUser } from '@auth0/nextjs-auth0/client'
import { Avatar } from './ui/avatar'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LuNotebookPen } from 'react-icons/lu'
import { usePlanContext } from '@/app/providers/usePlanContext'
import { useEffect, useState } from 'react'
import { SegmentedControl } from '@/components/ui/segmented-control'
import { RxDashboard } from 'react-icons/rx'

export function Header() {
  const { user } = useUser()
  const { hasPlan } = usePlanContext()
  const router = useRouter()
  const pathname = usePathname()
  const [value, setValue] = useState('plan')

  const goToHome = () => {
    router.push('/')
  }

  const handleCreatePage = () => {
    router.push('/plan')
  }

  const handleOnChange = (value: string) => {
    setValue(value)
    router.push(pageMap[value])
  }

  useEffect(() => {
    setValue(pageMap[pathname])
  }, [pathname])

  return (
    <header>
      <Flex justify="space-between" align="center" marginTop="1rem">
        <Flex gap="1rem" align="center">
          <Heading size="2xl" onClick={goToHome} cursor="pointer">
            The Planner
          </Heading>
          {hasPlan && (
            <SegmentedControl
              size="lg"
              value={value}
              onValueChange={(e) => handleOnChange(e.value)}
              items={items}
            />
          )}
        </Flex>
        <Flex gap="5px" alignItems="center">
          {user ? (
            <Flex gap="1rem" alignItems="center">
              {!hasPlan && (
                <Button variant="outline" colorPalette="green" onClick={handleCreatePage}>
                  <LuNotebookPen />
                  Create Plan
                </Button>
              )}
              <Avatar
                name={user?.name || 'User'}
                src={user?.picture || ''}
                shape="full"
                size="lg"
              />
              <Link href="/api/auth/logout" className="flex flex-col justify-center items-center gap-2"><SlLogout /> <Text textStyle="xs">Logout</Text></Link>
            </Flex>
          ) : (
            <Link href="/api/auth/login" className="flex flex-col justify-center items-center gap-2"><SlLogin /> <Text textStyle="xs">Login</Text></Link>
          )}
          <ColorModeButton />
        </Flex>
      </Flex>
      <Separator margin="1rem 0" />
    </header>
  )
}

const pageMap: Record<string, string> = {
  dashboard: '/dashboard',
  plan: '/plan/view',
  '/dashboard': 'dashboard',
  '/plan/view': 'plan',
}

const items = [
  {
    value: "dashboard",
    label: (
      <HStack>
        <RxDashboard />
        Dashboard
      </HStack>
    ),
  },
  {
    value: "plan",
    label: (
      <HStack>
        <SlNotebook />
        Plan
      </HStack>
    ),
  },
]
