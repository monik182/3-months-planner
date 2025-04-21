'use client';
import React, { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers/AuthContext';

export default function Login() {
  const { session, supabaseClient } = useAuth();
  const navigate = useRouter();

  useEffect(() => {
    if (session) {
      navigate.push('/');
    }
  }, [session, navigate]);

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>
        <Auth
          supabaseClient={supabaseClient}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#000',
                  brandAccent: '#000',
                },
              },
            },
          }}
          providers={['google']}
        />
      </div>
    </div>
  );
}
