import { Flex, Heading, Text } from '@chakra-ui/react';

interface StepLayoutProps {
  title: string;
  description?: string | React.ReactNode;
  children: React.ReactNode;
}

export function StepLayout({ title, description, children }: StepLayoutProps) {
  const _description = typeof description === 'string' ? <Text textStyle="sm">{description}</Text> : description

  return (
    <Flex overflow="auto" height="100%" direction="column" paddingBottom="2rem" scrollbarWidth="thin">
      <Heading size="xl" fontWeight="bold">{title}</Heading>
      {description && (
        _description
      )}
      <Flex direction="column" height="100%" paddingTop="1rem">
        {children}
      </Flex>
    </Flex>
  )
}
