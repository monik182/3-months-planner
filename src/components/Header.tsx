'use client'
import { Flex, HStack, Heading, IconButton, Separator, Text } from '@chakra-ui/react'
import { SlLogin, SlLogout, SlNotebook } from 'react-icons/sl'
import { usePathname, useRouter } from 'next/navigation'
import { Avatar } from './ui/avatar'
import { Button } from '@/components/ui/button'
import { LuNotebookPen } from 'react-icons/lu'
import { usePlanContext } from '@/app/providers/usePlanContext'
import { useEffect, useState } from 'react'
import { SegmentedControl } from '@/components/ui/segmented-control'
import { RxDashboard } from 'react-icons/rx'
import { useAccountContext } from '@/app/providers/useAccountContext'
import Link from 'next/link'
import { clearDatabase } from '@/db/dexieHandler'
import { SyncService } from '@/services/sync'
import { useAuth } from '@/app/providers/AuthContext'

export function Header() {
  const { user, isGuest } = useAccountContext()
  const { session, signOut } = useAuth()
  const { hasStartedPlan } = usePlanContext()
  const router = useRouter()
  const pathname = usePathname()
  const [value, setValue] = useState('plan')
  const showCreatePlanButton = !!user && !isGuest && !hasStartedPlan && pathname !== '/plan'

  const goToHome = () => {
    if (hasStartedPlan)
    return router.push('/dashboard')
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

  const handleLogout = async () => {
    await clearDatabase()
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('sb-')) {
        localStorage.removeItem(key);
      }
    })
    router.push('/')
    await signOut()
    window.location.reload()
  }

  return (
    <header style={{ backgroundColor: "white" }}>
      <Flex justify="space-between" align="center" marginTop="1rem">
        <Flex gap="1rem" align="center">
          <Heading size={{ md: "2xl", base: "xl" }} color="black" onClick={goToHome} cursor="pointer">
            The Planner
          </Heading>
        </Flex>
        {hasStartedPlan && (
          <SegmentedControl
            size={{ base: "sm", lg: "lg" }}
            value={value}
            onValueChange={(e) => handleOnChange(e.value)}
            items={items}
          />
        )}
        <Flex gap="5px" alignItems="center">
          <Flex gap="1rem" alignItems="center">
            {showCreatePlanButton && (
              <Button variant="outline" colorPalette="yellow" onClick={handleCreatePlan}>
                <LuNotebookPen />
                Create Plan
              </Button>
            )}
            <Avatar
              name="User"
              shape="full"
              src={user?.picture || 'https://ui-avatars.com/api/?background=000&color=fff&rounded=true&name=Guest%20User'}
              size="xs"
            />
            {!!session && SyncService.isEnabled && (
              <IconButton 
                size="xs"
                variant="ghost"
                onClick={handleLogout} 
                className="flex flex-col justify-center items-center gap-2"
              >
                <SlLogout /> 
                <Text textStyle="xs">Logout</Text>
              </IconButton>
            )}
          </Flex>
          {!session && SyncService.isEnabled && (
            <Link href="/login" className="flex flex-col justify-center items-center gap-2"><SlLogin /> <Text textStyle="xs">Login</Text></Link>
          )}
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
        <Text display={{ base: 'none', md: 'inline' }}>Dashboard</Text>
      </HStack>
    ),
  },
  {
    value: "plan",
    label: (
      <HStack>
        <SlNotebook />
        <Text display={{ base: 'none', md: 'inline' }}>Plan</Text>
      </HStack>
    ),
  },
]
