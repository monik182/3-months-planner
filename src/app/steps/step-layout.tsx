import { Flex, Heading, Text } from '@chakra-ui/react';

interface StepLayoutProps {
  title: string;
  description?: string | React.ReactNode;
  children: React.ReactNode;
}

export function StepLayout({ title, description, children }: StepLayoutProps) {
  return (
    <div className="h-full overflow-hidden">
      <Heading size="xl" fontWeight="bold">{title}</Heading>
      {description && (
        <Text textStyle="sm">
          {description}
        </Text>
      )}
      <Flex direction="column" height="100%" maxHeight="100%" overflow="hidden" paddingTop="1rem">
        {children}
      </Flex>
    </div>
  )
}
