'use client'
import { Flex, HStack, Heading, IconButton, Separator, Text, Link as ChakraLink } from '@chakra-ui/react'
import { SlLogin, SlLogout, SlNotebook } from 'react-icons/sl'
import { LuUserPlus } from 'react-icons/lu'
import { RiHome2Line } from 'react-icons/ri'
import { RxDashboard } from 'react-icons/rx'
import { PiFileText } from 'react-icons/pi'
import { useRouter } from 'next/navigation'
import { Avatar } from './ui/avatar'
import Link from 'next/link'
import { SyncService } from '@/services/sync'
import { useAuth } from '@/app/providers/AuthProvider'
import { logout } from '@/services/auth'
import { clearStrategyOrder } from '@/app/util/order'

export function Header() {
  const { session, user } = useAuth()
  const router = useRouter()
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
    <header className="backdrop-blur bg-white/70">
      <Flex
        justify="space-between"
        align="center"
        flexWrap="wrap"
        paddingY="3"
        paddingX={{ base: 2, md: 4 }}
      >
        <Heading
          size={{ md: '2xl', base: 'xl' }}
          color="black"
          onClick={() => router.push('/')}
          cursor="pointer"
        >
          The Planner
        </Heading>
        <HStack spacing={{ base: 2, md: 4 }} marginTop={{ base: 2, md: 0 }}>
          <ChakraLink as={Link} href="/" display="flex" alignItems="center" gap="1">
            <RiHome2Line />
            <Text display={{ base: 'none', md: 'inline' }}>Home</Text>
          </ChakraLink>
          <ChakraLink as={Link} href="/plan-v2" display="flex" alignItems="center" gap="1">
            <SlNotebook />
            <Text display={{ base: 'none', md: 'inline' }}>Plan</Text>
          </ChakraLink>
          <ChakraLink as={Link} href="/dashboard-v2" display="flex" alignItems="center" gap="1">
            <RxDashboard />
            <Text display={{ base: 'none', md: 'inline' }}>Dashboard</Text>
          </ChakraLink>
          <ChakraLink as={Link} href="/templates" display="flex" alignItems="center" gap="1">
            <PiFileText />
            <Text display={{ base: 'none', md: 'inline' }}>Templates</Text>
          </ChakraLink>
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
            <HStack spacing={2}>
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
                href="/Signup"
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

