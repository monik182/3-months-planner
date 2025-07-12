'use client';

import NextLink from 'next/link';
import { useState, useMemo } from 'react';
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
  HStack,
  Separator,
} from '@chakra-ui/react';
import { signup } from '@/services/auth';
import { Tooltip } from '@/components/ui/tooltip';
import { CiCircleInfo } from 'react-icons/ci';
import { OneTapComponent } from '@/components/OneTap';

// const passwordRequirements = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const passwordRequirements = /^.{8,}$/;

export const formSchema = z
  .object({
    email: z.email({ message: 'Please enter a valid email.' }),
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

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
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
    formData.append('email', values.email);
    formData.append('password', values.password);

    try {
      const response = await signup(formData);
      if (response.error) {
        setError(response.error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" px={4}>
      <Box w="full" maxW="md" p={6} borderWidth={1} borderRadius="md" boxShadow="md">
        {/* Header */}
        <Box textAlign="center" mb={4}>
          <Text fontSize="2xl" fontWeight="bold">
            Create an account
          </Text>
          <Text color="gray.600">Start your journey with us</Text>
        </Box>

        <OneTapComponent context="signup" />

        <HStack my={4}>
          <Separator flex="1" />
          <Text flexShrink="0" color="gray.500" fontSize="sm">or</Text>
          <Separator flex="1" />
        </HStack>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={6}>
            {/* Email */}
            <Field.Root invalid={!!errors.email}>
              <Field.Label>Email</Field.Label>
              <Input
                type="email"
                placeholder="Your email address"
                bg="white"
                {...register('email')}
              />
              <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
            </Field.Root>

            {/* Password */}
            <Field.Root invalid={!!errors.password}>
              <Field.Label>
                Password{' '}
                <Tooltip
                  content={
                    <Box fontSize="xs" textAlign="left">
                      Password must be at least 8 characters
                      {/* and contain: */}
                      {/* <Box as="ul" pl={4} mt={1}>
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
              <Field.Label>Confirm password</Field.Label>
              <Input
                type="password"
                placeholder="Repeat your password"
                bg="white"
                {...register('confirmPassword')}
              />
              <Field.ErrorText>{errors.confirmPassword?.message}</Field.ErrorText>
            </Field.Root>

            {/* Submit */}
            <Button type="submit" w="full" colorScheme="blue" disabled={isLoading}>
              {isLoading ? (
                <Stack direction="row" align="center" justify="center">
                  <Spinner size="sm" />
                  <Text>Creating...</Text>
                </Stack>
              ) : (
                'Create account'
              )}
            </Button>

            {/* Error Alert */}
            {error && (
              <Alert.Root status="error" borderRadius="md">
                <Alert.Indicator />
                <Box flex="1" textAlign="left">
                  <Alert.Title>Error Creating Account</Alert.Title>
                  <Alert.Description>{error}</Alert.Description>
                </Box>
              </Alert.Root>
            )}
          </Stack>
        </form>

        {/* Footer Link */}
        <VStack mt={6} fontSize="sm">
          <ChakraLink as={NextLink} href="/login" textAlign="center" color="gray.500" fontSize="sm">
            Already have an account? Sign in
          </ChakraLink>
        </VStack>
      </Box>
    </Box>
  );
}
