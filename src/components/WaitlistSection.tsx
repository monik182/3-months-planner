import { useState } from 'react'
import {
  Box,
  Input,
  Text,
  VStack,
  Heading,
  // HStack,
  // Link,
} from '@chakra-ui/react'
// import { FaLinkedin, FaInstagram } from 'react-icons/fa'
import { toaster } from '@/components/ui/toaster'
import { Button } from '@/components/ui/button'
import { useWaitlistActions } from '@/app/hooks/useWaitlistActions'
import { useRouter } from 'next/navigation'
import cuid from 'cuid'
import { ENABLE_CLOUD_SYNC } from '@/app/constants'

export function WaitListSection() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const { useCreate } = useWaitlistActions()
  const create = useCreate()
  const inviteToken = !ENABLE_CLOUD_SYNC ? cuid() : undefined

  const handleSubmit = async () => {
    if (!email.includes('@')) {
      toaster.create({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        type: 'error',
        duration: 2000,
      })
      return
    }

    create.mutate({ email, invited: !ENABLE_CLOUD_SYNC, inviteToken  }, {
      onSuccess: (response: any) => {
        if (!response.ok) {
          throw new Error(response.message)
        }

        toaster.create({
          title: 'Success!',
          description: "You've been added to the waitlist 🎉",
          type: 'success',
          duration: 2000,
        })

        setEmail('')
        if (!ENABLE_CLOUD_SYNC) {
          setTimeout(() => {
            router.replace(`/early-access?token=${inviteToken}`)
          }, 1000)
        } else {
          router.replace(`/#get-started`)
        }

      },
      onError: (error) => {
        toaster.create({
          title: 'Error',
          description: error.message || 'Something went wrong. Try again later.',
          type: 'error',
          duration: 2000,
        })
      },
    })
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Enter' || event.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <Box
      textAlign="center"
      py={10}
      px={6}
      bg="white"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Heading fontSize={{ lg: "3xl", base: "xl" }} fontWeight="bold" mb={4}>
        Join Our Waitlist: Be the First to Discover What&apos;s Coming!
      </Heading>
      <Text fontSize={{ lg: "lg", base: "md" }} color="gray.600" mb={6}>
        Stay Focused and Achieve More: Get Early Access to <strong>The Planner</strong>, Your 12-Week Year Success Tool!
      </Text>

      <VStack gap={4} width={{ base: "90%", md: "40%" }}>
        <Input
          placeholder="Enter your email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          size="lg"
          bg="white"
          border="1px solid"
          borderColor="gray.300"
          _focus={{ borderColor: "black" }}
          onKeyDown={handleKeyDown}
        />
        <Button
          bg="black"
          color="white"
          size="lg"
          width="100%"
          _hover={{ opacity: 0.8 }}
          onClick={handleSubmit}
          loading={create.isPending}
          loadingText="Joining..."
        >
          Get Early Access
        </Button>
      </VStack>

      {/* <Text fontSize="md" color="gray.600" mt={6}>
        Check us out on social media ⚡
      </Text>

      <HStack gap={10} mt={4}>
        <Link href="#">
          <FaLinkedin size={20} />
        </Link>
        <Link href="#">
          <FaInstagram size={20} />
        </Link>
      </HStack> */}
    </Box>
  )
}
