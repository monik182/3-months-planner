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

export function WaitListSection() {
  const [email, setEmail] = useState('')
  const { useCreate } = useWaitlistActions()
  const create = useCreate()

  const handleSubmit = async () => {
    if (!email.includes('@')) {
      toaster.create({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        type: 'error',
        duration: 3000,
      })
      return
    }

    create.mutate({ email }, {
      onSuccess: (response: any) => {
        if (!response.ok) {
          throw new Error(response.message)
        }

        toaster.create({
          title: 'Success!',
          description: "You've been added to the waitlist 🎉",
          type: 'success',
          duration: 4000,
        })

        setEmail('')
      },
      onError: (error) => {
        toaster.create({
          title: 'Error',
          description: error.message || 'Something went wrong. Try again later.',
          type: 'error',
          duration: 4000,
        })
      },
    })
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
      <Heading fontSize="3xl" fontWeight="bold" mb={4}>
        Join Our Waitlist: Be the First to Discover What&apos;s Coming!
      </Heading>
      <Text fontSize="lg" color="gray.600" mb={6}>
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
