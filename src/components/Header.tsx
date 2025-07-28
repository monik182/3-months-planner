'use client'
import { Flex, HStack, Heading, IconButton, Separator, Text, Link } from '@chakra-ui/react'
import { SlLogin, SlLogout, SlNotebook } from 'react-icons/sl'
import { LuUserPlus } from 'react-icons/lu'
import { AiOutlineBarChart } from 'react-icons/ai'
// import { RiHome2Line } from 'react-icons/ri'
import { RxDashboard } from 'react-icons/rx'
// import { PiFileText } from 'react-icons/pi'
import { useRouter, usePathname } from 'next/navigation'
import { Avatar } from './ui/avatar'
import { SyncService } from '@/services/sync'
import { useAuth } from '@/app/providers/AuthProvider'
import { logout } from '@/services/auth'
import { clearStrategyOrder } from '@/app/util/order'
import { usePlanContext } from '@/app/providers/usePlanContext'
import Image from 'next/image'
import NextLink from 'next/link'
// import { PiFileText } from 'react-icons/pi'

export function Header() {
  const { session, user } = useAuth()
  const { hasPlan } = usePlanContext()
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
          <Link asChild variant="plain" textDecoration="none">
            <NextLink href="/">
              <Image src="/logo-icon-no-bg.png" alt="The Planner" width="35" height="35" />
              The Planner
            </NextLink>
          </Link>
        </Heading>
        {!!session && (
          <HStack gap={{ base: 2, md: 4 }} marginTop={{ base: 2, md: 0 }}>
            <Link asChild variant="plain" textDecoration="none" fontWeight={pathname.startsWith('/dashboard') ? 'bold' : 'normal'}>
              <NextLink href="/dashboard">
                <RxDashboard />
                <Text display={{ base: 'none', md: 'inline' }}>Dashboard</Text>
              </NextLink>
            </Link>
            <Link asChild variant="plain" textDecoration="none" fontWeight={pathname.startsWith('/plan') ? 'bold' : 'normal'}>
              <NextLink href="/plan">
                <SlNotebook />
                <Text display={{ base: 'none', md: 'inline' }}>Plan</Text>
              </NextLink>
            </Link>
            {hasPlan && (
              <Link asChild variant="plain" textDecoration="none" fontWeight={pathname.startsWith('/progress') ? 'bold' : 'normal'}>
                <NextLink href="/progress">
                  <AiOutlineBarChart />
                  <Text display={{ base: 'none', md: 'inline' }}>Progress</Text>
                </NextLink>
              </Link>
            )}
            {/* <Link asChild variant="plain" textDecoration="none" fontWeight={pathname.startsWith('/templates') ? 'bold' : 'normal'}>
              <NextLink href="/templates">
                <PiFileText />
                <Text display={{ base: 'none', md: 'inline' }}>Templates</Text>
              </NextLink>
            </Link> */}
          </HStack>
        )}
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
              <Link asChild variant="plain" textDecoration="none" className="flex flex-col justify-center items-center gap-1">
                <NextLink href="/login">
                  <SlLogin />
                  <Text textStyle="xs">Login</Text>
                </NextLink>
              </Link>
              <Link asChild variant="plain" textDecoration="none" className="flex flex-col justify-center items-center gap-1">
                <NextLink href="/join">
                  <LuUserPlus />
                  <Text textStyle="xs">Join</Text>
                </NextLink>
              </Link>
            </HStack>
          )}
        </Flex>
      </Flex>
      <Separator marginY="1rem" />
    </header>
  )
}
