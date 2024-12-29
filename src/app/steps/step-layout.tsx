import { Heading, Text } from '@chakra-ui/react';

interface StepLayoutProps {
  title: string;
  description?: string | React.ReactNode;
  children: React.ReactNode;
}

export function StepLayout({ title, description, children }: StepLayoutProps) {
  return (
    <div>
      <Heading size="xl" fontWeight="bold">{title}</Heading>
      {description && (
        <Text textStyle="xs">
          {description}
        </Text>
      )}
      {children}
    </div>
  )
}
