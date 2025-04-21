'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

interface AuthContextType {
  session: Session | null;
  user: Session['user'] | null;
  isNewUser: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  supabaseClient: SupabaseClient;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setSession(data.session);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (error) throw error;

      setSession(data.session);
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // console.log('Auth event:', event);
      // console.log('Session:', session);

      switch (event) {
        case 'INITIAL_SESSION':
          if (!!session) {
            setIsNewUser(true);
          }
          // console.log('Initial session', session?.user?.id, session?.user?.user_metadata?.sub);
          break;
        // case 'PASSWORD_RECOVERY':
        //   console.log('Password recovery');
        //   break;
        // case 'SIGNED_IN':
        //   console.log('User signed in:', session?.user?.id);
        //   break;
        case 'SIGNED_OUT':
          // console.log('User signed out');
          setSession(null);
          break;
        // case 'TOKEN_REFRESHED':
        //   console.log('Token refreshed');
        //   break;
        // case 'USER_UPDATED':
        //   console.log('User updated');
        //   break;
        default:
          setSession(session);
          break;
      }
    });

    return () => subscription.unsubscribe();
  }, []);
  

  return (
    <AuthContext.Provider value={{ session, user: session?.user || null, isNewUser, signIn, signUp, signOut, resetPassword, supabaseClient: supabase }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
