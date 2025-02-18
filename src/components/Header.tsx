'use client'
import { Flex, HStack, Heading, Separator, Text } from '@chakra-ui/react'
import { ColorModeButton } from './ui/color-mode'
import { SlLogin, SlLogout, SlNotebook } from 'react-icons/sl'
import { usePathname, useRouter } from 'next/navigation'
import { Avatar } from './ui/avatar'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LuNotebookPen } from 'react-icons/lu'
import { usePlanContext } from '@/app/providers/usePlanContext'
import { useEffect, useState } from 'react'
import { SegmentedControl } from '@/components/ui/segmented-control'
import { RxDashboard } from 'react-icons/rx'
import { useAccountContext } from '@/app/providers/useAccountContext'

export function Header() {
  const { user, isGuest } = useAccountContext()
  const { hasPlan } = usePlanContext()
  const router = useRouter()
  const pathname = usePathname()
  const [value, setValue] = useState('plan')
  const showCreatePlanButton = !hasPlan && pathname !== '/plan'

  const goToHome = () => {
    router.push('/')
  }

  const handleCreatePlan = () => {
    router.push('/plan/new')
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
              {showCreatePlanButton && (
                <Button variant="outline" colorPalette="yellow" onClick={handleCreatePlan}>
                  <LuNotebookPen />
                  Create Plan
                </Button>
              )}
              <Avatar
                name="User"
                src={user?.picture || 'https://ui-avatars.com/api/?background=000&color=fff&rounded=true&name=Test%20User'}
                shape="full"
                size="md"
              />
              {!isGuest && (
                <Link href="/api/auth/logout" className="flex flex-col justify-center items-center gap-2"><SlLogout /> <Text textStyle="xs">Logout</Text></Link>
              )}
            </Flex>
          ) : (
            !isGuest && (
              <Link href="/api/auth/login" className="flex flex-col justify-center items-center gap-2"><SlLogin /> <Text textStyle="xs">Login</Text></Link>
            )
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
