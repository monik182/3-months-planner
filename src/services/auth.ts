'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/app/util/supabase/server'

export async function login(formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient();
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error('❌ Auth error', error);
    const isInvalidCreds = error.status === 400 && error.code === 'invalid_credentials';
    const isFetchFailure = error.message?.includes('fetch failed') || error.status === 0;

    if (isInvalidCreds) {
      return { error: 'Invalid email or password' };
    } else if (isFetchFailure) {
      return { error: 'Network error. Please try again in a few seconds.' };
    } else {
      return { error: error.message || 'Unexpected error occurred' };
    }
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signup(formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    // Log full error for debugging
    console.error('❌ Signup error:', error);

    // Return friendly messages based on known Supabase auth error codes
    switch (error.code) {
      case 'email_exists':
      case 'user_already_exists':
        return { error: 'This email is already registered. Please sign in instead.' };
      case 'invalid_password':
      case 'weak_password':
        return {
          error:
            'Password is too weak. It must contain at least 8 characters, including uppercase, lowercase, and a number.',
        };
      default:
        break;
    }

    // Fallbacks based on status/message
    if (error.status === 400 && error.message?.includes('already registered')) {
      return { error: 'This email is already registered. Please sign in instead.' };
    }
    const isFetchFailure = error.message?.includes('fetch failed') || error.status === 0;

    if (isFetchFailure) {
      return { error: 'Network error. Please try again in a few seconds.' };
    }

    return { error: error.message || 'Something went wrong. Please try again.' };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('❌ Logout error:', error.message);
    const isFetchFailure = error.message?.includes('fetch failed') || error.status === 0;

    if (isFetchFailure) {
      return { error: 'Network error. Please try again in a few seconds.' };
    }
    return { error: error.message || 'Logout failed. Please try again.' };
  }

  revalidatePath('/', 'layout');
  redirect('/login');
}

export async function recoverPassword(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
  });

  if (error) {
    console.error('❌ Recovery error:', error);
    const isFetchFailure = error.message?.includes('fetch failed') || error.status === 0;

    if (isFetchFailure) {
      return { error: 'Network error. Please try again in a few seconds.' };
    }

    switch (error.code) {
      case 'user_not_found':
        return { error: 'There is no account associated with this email.' };
      default:
        return { error: error.message || 'Failed to send password recovery email.' };
    }
  }

  return { success: true };
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();

  const password = formData.get('password') as string;

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.error('❌ Password update error:', error);
    const isFetchFailure = error.message?.includes('fetch failed') || error.status === 0;

    if (isFetchFailure) {
      return { error: 'Network error. Please try again in a few seconds.' };
    }
    return { error: error.message || 'Failed to update password.' };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}
