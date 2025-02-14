'use client'
import { useState, useRef } from 'react'
import { Box, Button, Text, Textarea } from '@chakra-ui/react'
import { toaster } from '@/components/ui/toaster'
import { BsChatRight } from 'react-icons/bs'
import { IoMdClose } from 'react-icons/io'

export function FloatingFeedback() {
  const [isOpen, setIsOpen] = useState(false)
  const [feedback, setFeedback] = useState('')
  const boxRef = useRef<HTMLDivElement>(null)

  const handleSubmit = () => {
    if (!feedback.trim()) {
      toaster.create({
        title: 'Feedback is empty',
        description: 'Please enter your feedback before submitting.',
        type: 'warning',
        duration: 1000,
      })
      return
    }

    console.log('Feedback submitted:', feedback)

    toaster.create({
      title: 'Feedback submitted',
      description: 'Thank you for your feedback!',
      type: 'success',
      duration: 1000,
    })

    setFeedback('')
    setIsOpen(false)
  }

  const handleToggle = () => setIsOpen((prev) => !prev)

  return (
    <>
      <Button
        aria-label="Give Feedback"
        position="fixed"
        bottom="20px"
        right="20px"
        boxShadow="lg"
        borderRadius="full"
        size="lg"
        onClick={handleToggle}
      >
        <Text fontSize="sm">Feedback</Text>
        {isOpen ? <IoMdClose /> : <BsChatRight />}
      </Button>

      {isOpen && (
        <Box
          ref={boxRef}
          position="fixed"
          bottom="80px"
          right="20px"
          p="10px"
          w="300px"
          bg="white"
          boxShadow="xl"
          borderRadius="md"
          zIndex="1000"
        >
          <Textarea
            placeholder="Share your feedback..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            size="sm"
            mb={2}
          />
          <Button size="xs" onClick={handleSubmit} disabled={!feedback.trim()}>
            Submit
          </Button>
        </Box>
      )}
    </>
  )
}
