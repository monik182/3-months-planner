'use client'
import { usePlanContext } from '@/app/providers/usePlanContext'
import { useUser } from '@auth0/nextjs-auth0/client'
import { Flex } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { user } = useUser()
  const { hasPlan } = usePlanContext()
  const router = useRouter()

  if (hasPlan) {
    router.push('/dashboard')
  }

  if (!!user && !hasPlan) {
    router.push('/plan')
  }

  return (
    <Flex>
      HERE COMES THE HOME PAGE....
    </Flex>
  )
}
