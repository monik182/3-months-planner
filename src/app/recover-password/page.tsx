'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Center,
  Stack,
  Input,
  Button,
  Spinner,
  Alert,
  Link as ChakraLink,
  Field,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { recoverPassword } from '@/services/auth';

const formSchema = z.object({
  email: z.email({ message: 'Please enter a valid email.' }),
});

export default function RecoverPassword() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('email', values.email);

    try {
      const response = await recoverPassword(formData);
      if (response.error) {
        setError(response.error);
      } else {
        setEmailSent(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedirect = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://mail.google.com', '_blank');
    window.close();
  };

  useEffect(() => {
    if (emailSent) {
      const timer = setTimeout(() => {
        router.replace('/login');
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [emailSent, router]);

  if (emailSent) {
    return (
      <Center minH="100vh" px={4}>
        <Stack gap={4} maxW="sm" textAlign="center">
          <Box fontSize="2xl" fontWeight="bold">
            Check your email
          </Box>
          <Box color="gray.600" fontSize="sm">
            We've sent a password reset link to your email.
          </Box>
          <ChakraLink as="button" onClick={handleRedirect} style={{ textDecoration: 'none' }}>
            <Button w="full" colorScheme="blue">
              Open Gmail
            </Button>
          </ChakraLink>
        </Stack>
      </Center>
    );
  }

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" px={4}>
      <Box w="full" maxW="md" p={6} borderWidth={1} borderRadius="md" boxShadow="md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={6}>
            <Field.Root invalid={!!errors.email}>
              <Field.Label>Email</Field.Label>
              <Input
                placeholder="Your email address"
                bg="white"
                {...register('email')}
              />
              <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
            </Field.Root>

            <Button type="submit" w="full" colorScheme="blue" disabled={isLoading}>
              {isLoading ? (
                <Stack direction="row" align="center" justify="center">
                  <Spinner size="sm" />
                  <Box>Sending...</Box>
                </Stack>
              ) : (
                'Send recovery email'
              )}
            </Button>

            {error && (
              <Alert.Root status="error" borderRadius="md">
                <Alert.Indicator />
                <Box flex="1" textAlign="left">
                  <Alert.Title>Error Sending Email</Alert.Title>
                  <Alert.Description>{error}</Alert.Description>
                </Box>
              </Alert.Root>
            )}
          </Stack>
        </form>
      </Box>
    </Box>
  );
}
