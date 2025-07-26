'use client'
import { Flex, HStack, Heading, IconButton, Separator, Text, Link as ChakraLink } from '@chakra-ui/react'
import { SlLogin, SlLogout, SlNotebook } from 'react-icons/sl'
import { LuUserPlus } from 'react-icons/lu'
import { AiOutlineBarChart } from 'react-icons/ai'
// import { RiHome2Line } from 'react-icons/ri'
import { RxDashboard } from 'react-icons/rx'
// import { PiFileText } from 'react-icons/pi'
import { useRouter, usePathname } from 'next/navigation'
import { Avatar } from './ui/avatar'
import Link from 'next/link'
import { SyncService } from '@/services/sync'
import { useAuth } from '@/app/providers/AuthProvider'
import { logout } from '@/services/auth'
import { clearStrategyOrder } from '@/app/util/order'
import { usePlanContext } from '@/app/providers/usePlanContext'

export function Header() {
  const { session, user } = useAuth()
  const { hasStartedPlan } = usePlanContext()
  const router = useRouter()
  const pathname = usePathname()
  const userAvatar = user?.user_metadata?.picture || `https://ui-avatars.com/api/?background=000&color=fff&rounded=true&name=${user?.email?.split('@')[0] || user?.user_metadata?.name || 'Guest%20User'}`

  const handleLogout = async () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('sb-')) {
        localStorage.removeItem(key);
      }
    })
    clearStrategyOrder()
    router.push('/')
    await logout()
    window.location.reload()
  }

  return (
    <header className="backdrop-blur bg-white/70 fixed top-0 left-0 right-0 px-8 z-50">
      <Flex
        justify="space-between"
        align="center"
        flexWrap="wrap"
        paddingY="3"
        paddingX={{ base: 2, md: 4 }}
      >
        <Heading size={{ md: '2xl', base: 'xl' }} color="black">
          <ChakraLink as={Link} href="/"  _hover={{ textDecoration: 'none' }}>
            The Planner
          </ChakraLink>
        </Heading>
        <HStack gap={{ base: 2, md: 4 }} marginTop={{ base: 2, md: 0 }}>
          {/* <ChakraLink
            as={Link}
            href="/"
            
            display="flex"
            alignItems="center"
            gap="1"
            fontWeight={pathname === '/' ? 'bold' : 'normal'}
          >
            <RiHome2Line />
            <Text display={{ base: 'none', md: 'inline' }}>Home</Text>
          </ChakraLink> */}
          <ChakraLink
            as={Link}
            href="/dashboard"

            display="flex"
            alignItems="center"
            gap="1"
            fontWeight={pathname.startsWith('/dashboard') ? 'bold' : 'normal'}
          >
            <RxDashboard />
            <Text display={{ base: 'none', md: 'inline' }}>Dashboard</Text>
          </ChakraLink>
          <ChakraLink
            as={Link}
            href="/plan"
            
            display="flex"
            alignItems="center"
            gap="1"
            fontWeight={pathname.startsWith('/plan') ? 'bold' : 'normal'}
          >
            <SlNotebook />
            <Text display={{ base: 'none', md: 'inline' }}>Plan</Text>
          </ChakraLink>
          {hasStartedPlan && (
            <ChakraLink
              as={Link}
              href="/progress"

              display="flex"
              alignItems="center"
              gap="1"
              fontWeight={pathname.startsWith('/progress') ? 'bold' : 'normal'}
            >
              <AiOutlineBarChart />
              <Text display={{ base: 'none', md: 'inline' }}>Progress</Text>
            </ChakraLink>
          )}
          {/* <ChakraLink
            as={Link}
            href="/templates"
            
            display="flex"
            alignItems="center"
            gap="1"
            fontWeight={pathname.startsWith('/templates') ? 'bold' : 'normal'}
          >
            <PiFileText />
            <Text display={{ base: 'none', md: 'inline' }}>Templates</Text>
          </ChakraLink> */}
        </HStack>
        <Flex gap={{ base: 2, md: 4 }} alignItems="center" marginTop={{ base: 2, md: 0 }}>
          {!!session && (
            <Avatar name="User" shape="full" src={userAvatar} size="xs" />
          )}
          {!!session && SyncService.isEnabled && (
            <IconButton
              size="xs"
              variant="ghost"
              onClick={handleLogout}
              className="flex flex-col justify-center items-center gap-1"
            >
              <SlLogout />
              <Text textStyle="xs">Logout</Text>
            </IconButton>
          )}
          {!session && SyncService.isEnabled && (
            <HStack gap={2}>
              <ChakraLink
                as={Link}
                href="/login"
                
                className="flex flex-col justify-center items-center gap-1"
              >
                <SlLogin />
                <Text textStyle="xs">Login</Text>
              </ChakraLink>
              <ChakraLink
                as={Link}
                href="/signup"
                
                className="flex flex-col justify-center items-center gap-1"
              >
                <LuUserPlus />
                <Text textStyle="xs">Signup</Text>
              </ChakraLink>
            </HStack>
          )}
        </Flex>
      </Flex>
      <Separator marginY="1rem" />
    </header>
  )
}

