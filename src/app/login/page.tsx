'use client';

import {
  Box,
  Button,
  Input,
  Alert,
  VStack,
  Heading,
  Text,
  Spinner,
  Link as ChakraLink,
  Field,
  HStack,
  Separator,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { login } from '@/services/auth';
import { OneTap } from '@/components/OneTap';

const formSchema = z.object({
  email: z.email({ message: 'Please enter a valid email.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
});
type FormValues = z.infer<typeof formSchema>;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('email', values.email);
    formData.append('password', values.password);

    try {
      const response = await login(formData);
      console.log('response', response);
      if (response.error) setError(response.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" px={4}>
      <Box w="full" maxW="md" p={6} borderWidth={1} borderRadius="md" boxShadow="md">
        <VStack gap={4} textAlign="center" mb={4}>
          <Heading size="lg">Welcome back</Heading>
          <Text color="gray.600">Sign in to your account</Text>
        </VStack>

        <OneTap context="signin" onError={setError} />

        <HStack my={4}>
          <Separator flex="1" />
          <Text flexShrink="0" color="gray.500" fontSize="sm">or</Text>
          <Separator flex="1" />
        </HStack>

        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack gap={4}>
            <Field.Root invalid={!!errors.email}>
              <Field.Label>Email</Field.Label>
              <Input
                placeholder="Your email address"
                {...register('email')}
                bg="white"
              />
              <Field.ErrorText>{errors.email && errors.email.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.password}>
              <Field.Label>Password</Field.Label>
              <Input
                type="password"
                placeholder="Your password"
                {...register('password')}
                bg="white"
              />
              <Field.ErrorText>{errors.password && errors.password.message}</Field.ErrorText>
            </Field.Root>

            <Button type="submit" disabled={isLoading} colorPalette="black" className="w-full">
              {isLoading ? (
                <Spinner size="sm" mr={2} />
              ) : null}
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </VStack>
        </form>

        {error && (
          <Alert.Root status="error" mt={4} borderRadius="md">
            <Alert.Indicator />
            <Box flex="1">
              <Alert.Title>Error Logging In</Alert.Title>
              <Alert.Description display="block">{error}</Alert.Description>
            </Box>
          </Alert.Root>
        )}

        <VStack gap={2} mt={6} fontSize="sm">
          <ChakraLink href="/recover-password" color="gray.500" _hover={{ textDecoration: 'underline' }} as={NextLink}>
            Forgot your password?
          </ChakraLink>
          <ChakraLink href="/join" color="gray.500" _hover={{ textDecoration: 'underline' }} as={NextLink}>
            Don&apos;t have an account? Join
          </ChakraLink>
        </VStack>
      </Box>
    </Box>
  );
}
