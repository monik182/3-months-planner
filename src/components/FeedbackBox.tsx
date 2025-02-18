'use client'
import { useState, useRef } from 'react'
import { Box, Flex, Text, Textarea, Image } from '@chakra-ui/react'
import { toaster } from '@/components/ui/toaster'
import { BsChatRight } from 'react-icons/bs'
import { IoMdClose } from 'react-icons/io'
import { useFeedbackActions } from '@/app/hooks/useFeedbackActions'
import { Button } from '@/components/ui/button'
import { CloseButton } from '@/components/ui/close-button'
import { useAccountContext } from '@/app/providers/useAccountContext'

// const MAX_FILES = 3

export function FloatingFeedback() {
  const [isOpen, setIsOpen] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const boxRef = useRef<HTMLDivElement>(null)
  const { user } = useAccountContext()
  const { useCreate } = useFeedbackActions()
  const create = useCreate()
  // const disableUpload = files.length >= MAX_FILES
  const disabled = create.isPending || !feedback.trim()

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

    create.mutate({ feedback, email: user?.email as string }, {
      onSuccess: (data: any) => {
        if (!data.ok) {
          throw new Error(JSON.stringify(data.error))
        }

        toaster.create({
          title: 'Feedback submitted',
          description: 'Thank you for your feedback!',
          type: 'success',
          duration: 1000,
        })

        setFeedback('')
        setIsOpen(false)
      },
      onError: (error) => {
        console.error(error)
        toaster.create({
          title: 'There was an error submitting your feedback',
          description: error.message || 'Something went wrong. Try again later.',
          type: 'error',
          duration: 2000,
        })
      },
    })
  }

  const handleToggle = () => setIsOpen((prev) => !prev)

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const newFiles = event.target.files ? Array.from(event.target.files) : []

  //   if (files.length + newFiles.length > MAX_FILES) {
  //     toaster.create({
  //       title: `Max ${MAX_FILES} files allowed.`,
  //       type: "warning",
  //       duration: 3000,
  //     })
  //     return
  //   }

  //   setFiles((prev) => [...prev, ...newFiles])
  // }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

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
          p={4}
          w="350px"
          bg="white"
          boxShadow="xl"
          borderRadius="md"
          zIndex="1000"
        >
          <Flex justify="space-between" align="center" mb={2}>
            <strong>Give Feedback</strong>
            <IoMdClose onClick={() => setIsOpen(false)} />
          </Flex>

          <Textarea
            placeholder="Ideas on how to improve this page..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            size="sm"
            mb={2}
          />

          <Flex gap={2} wrap="wrap">
            {files.map((file, index) => (
              <Box key={index} position="relative">
                {file.type.startsWith("image/") ? (
                  <Image src={URL.createObjectURL(file)} boxSize="50px" borderRadius="md" alt="upload" />
                ) : (
                  <Box
                    boxSize="50px"
                    bg="gray.200"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="md"
                  >
                  </Box>
                )}
                <CloseButton
                  size="sm"
                  position="absolute"
                  top="0"
                  right="0"
                  onClick={() => removeFile(index)}
                />
              </Box>
            ))}
          </Flex>

          {/* <Input
            type="file"
            accept="image/*"
            multiple
            display="none"
            onChange={handleFileChange}
            id="fileUpload"
            max={MAX_FILES}
            disabled={disableUpload}
          />
          <Button as="label" htmlFor="fileUpload" leftIcon={<MdOutlineAttachment />} variant="outline" size="sm" mt={2} mb={2} disabled={disableUpload}>
            Upload File
          </Button> */}

          <Flex justify="space-between">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button variant="ghost" size="sm" onClick={() => setFeedback('')}>Clear</Button>
            <Button size="sm" onClick={handleSubmit} disabled={disabled} loading={create.isPending}>
              Send feedback
            </Button>
          </Flex>
        </Box>
      )}
    </>
  )
}
