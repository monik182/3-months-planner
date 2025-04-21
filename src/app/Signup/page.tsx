'use client';
import React, { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useAuth } from '@/app/providers/AuthContext';
import { useRouter } from 'next/navigation';

export default function Signup() {
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
          <h2 className="text-2xl font-bold">Create an account</h2>
          <p className="text-muted-foreground">Start your journey with QuarterFocus</p>
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
          view="sign_up"
        />
      </div>
    </div>
  );
}
