'use client'
import { Flex, Heading, Separator, Text } from '@chakra-ui/react'
import { ColorModeButton } from './ui/color-mode'
import { SlLogin, SlLogout } from 'react-icons/sl'
import { useRouter } from 'next/navigation'
import { useUser } from '@auth0/nextjs-auth0/client'
import { Avatar } from './ui/avatar'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LuNotebookPen } from 'react-icons/lu'
import { usePlanContext } from '@/app/providers/usePlanContext'

export function Header() {
  const { user } = useUser()
  const { hasPlan } = usePlanContext()
  const router = useRouter()

  const goToHome = () => {
    router.push('/')
  }

  const handleCreatePage = () => {
    router.push('/plan')
  }

  return (
    <header>
      <Flex justify="space-between" align="center" marginTop="1rem">
        <Flex gap="1rem" align="center">
          <Heading size="2xl" onClick={goToHome}>
            3-Month Plan
          </Heading>
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
