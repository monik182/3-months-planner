'use client';

import NextLink from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import zxcvbn from 'zxcvbn';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Stack,
  Input,
  Button,
  Spinner,
  Alert,
  Text,
  Link as ChakraLink,
  Field,
  VStack,
  Progress,
} from '@chakra-ui/react';
import { Tooltip } from '@/components/ui/tooltip';
import { CiCircleInfo } from 'react-icons/ci';

interface ResetPasswordFormProps {
  token: string | null;
  resetPassword: (formData: FormData) => Promise<{ error?: string }>;
}

// const passwordRequirements = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const passwordRequirements = /^.{8,}$/;

export const formSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters.' })
      .regex(passwordRequirements, {
        message:
          'Password must contain at least one lowercase letter, one uppercase letter, and one digit.',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

const strengthColors = ['red.500', 'orange.400', 'yellow.400', 'green.500', 'green.700'];
const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];

export default function ResetPasswordForm({ resetPassword, token }: ResetPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const password = watch('password');
  const { score, feedback } = useMemo(() => {
    const r = zxcvbn(password);
    return {
      score: r.score,
      feedback: r.feedback.suggestions[0] || r.feedback.warning || '',
    };
  }, [password]);
  const color = strengthColors[score];
  const label = strengthLabels[score];
  const progressValue = (score + 1) * 20;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('password', values.password);

    try {
      const response = await resetPassword(formData);
      if (response.error) {
        setError(response.error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Clear transient errors
  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(t);
    }
  }, [error]);

  // Invalid token
  useEffect(() => {
    if (!token) {
      setError(
        'Email link is invalid or has expired. Please request a new password reset.'
      );
    }
  }, [token]);

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" px={4}>
      <Box w="full" maxW="md" p={6} borderWidth={1} borderRadius="md" boxShadow="md">
        <Stack gap={6}>
          <Box textAlign="center">
            <Text fontSize="2xl" fontWeight="bold">
              Recover Password
            </Text>
            <Text color="gray.600">Enter a new password for your account</Text>
          </Box>

          <Box borderTop="1px" borderColor="gray.300" />

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={6}>
              {/* Password Field */}
              <Field.Root invalid={!!errors.password}>
                <Field.Label>
                  Password{' '}
                  <Tooltip
                    content={
                      <Box fontSize="xs" textAlign="left">
                        Password must be at least 8 characters
                        {/* and contain:
                        <Box as="ul" pl={4} mt={1} gap={1}>
                          <Box as="li">One lowercase letter</Box>
                          <Box as="li">One uppercase letter</Box>
                          <Box as="li">One digit</Box>
                        </Box> */}
                      </Box>
                    }
                  >
                    <CiCircleInfo color="gray.500" cursor="pointer" />
                  </Tooltip>
                </Field.Label>
                <Input
                  type="password"
                  placeholder="Your password"
                  bg="white"
                  {...register('password')}
                />
                <Field.ErrorText>{errors.password?.message}</Field.ErrorText>

                {password && (
                  <Progress.Root value={progressValue} colorPalette={color.split('.')[0]} className="w-full mt-2">
                    <Progress.Track>
                      <Progress.Range />
                    </Progress.Track>
                    <VStack align="start" gap="2">
                      <Progress.Label>{label}</Progress.Label>
                      {feedback && <Progress.ValueText>{feedback}</Progress.ValueText>}
                    </VStack>
                  </Progress.Root>
                )}
              </Field.Root>

              {/* Confirm Password */}
              <Field.Root invalid={!!errors.confirmPassword}>
                <Field.Label>Confirm Password</Field.Label>
                <Input
                  type="password"
                  placeholder="Repeat your password"
                  bg="white"
                  {...register('confirmPassword')}
                />
                <Field.ErrorText>
                  {errors.confirmPassword?.message}
                </Field.ErrorText>
              </Field.Root>

              {/* Submit */}
              <Button
                type="submit"
                w="full"
                colorScheme="blue"
                disabled={isLoading || !token}
              >
                {isLoading ? (
                  <Stack direction="row" align="center" justify="center">
                    <Spinner size="sm" />
                    <Text>Resetting password...</Text>
                  </Stack>
                ) : (
                  'Reset Password'
                )}
              </Button>

              {/* Error Alert */}
              {error && (
                <Alert.Root status="error" borderRadius="md">
                  <Alert.Indicator />
                  <Box flex="1" textAlign="left">
                    <Alert.Title>Error Resetting Password</Alert.Title>
                    <Alert.Description>{error}</Alert.Description>
                  </Box>
                </Alert.Root>
              )}
            </Stack>
          </form>

          <VStack gap={2} textAlign="center" fontSize="sm">
            <ChakraLink as={NextLink} href="/login" color="gray.500">
              Already have an account? Sign in
            </ChakraLink>
            <ChakraLink as={NextLink} href="/signup" color="gray.500">
              Don’t have an account? Sign up
            </ChakraLink>
          </VStack>
        </Stack>
      </Box>
    </Box>
  );
}
