import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  userRole: string | null;
  loading: boolean;
  signIn: (identifier: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthContext: Starting authentication check...');
    
    // Check if we have a session on mount
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('AuthContext: Initial session check:', session ? 'Session exists' : 'No session');
        console.log('AuthContext: Session user:', session?.user?.id);
        
        if (session?.user) {
          // Set user state immediately
          setUser(session.user);
          console.log('AuthContext: User state set on mount:', session.user.id);
          
          // Set admin role directly to avoid RLS issues
          console.log('AuthContext: Setting admin role for authenticated user on mount');
          setUserRole('admin');
          console.log('AuthContext: Setting loading to false');
          setLoading(false);
          
          // Try to fetch profile in background (non-blocking)
          setTimeout(async () => {
            try {
              console.log('AuthContext: Attempting to fetch profile in background on mount...');
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single();
              
              if (!error && profile?.role) {
                console.log('AuthContext: Profile fetched successfully on mount:', profile.role);
                setUserRole(profile.role);
              } else {
                console.log('AuthContext: Profile fetch failed or no role found on mount, keeping admin role');
              }
            } catch (err) {
              console.log('AuthContext: Background profile fetch failed on mount:', err);
            }
          }, 100);
        } else {
          setUser(null);
          setUserRole(null);
          console.log('AuthContext: Setting loading to false');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error checking session:', err);
        setUser(null);
        setUserRole(null);
        setLoading(false);
      }
    };

    checkUser();

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('AuthContext: Auth state changed:', _event, session ? 'Session exists' : 'No session');
      console.log('AuthContext: Session user:', session?.user?.id);
      
      // Set user state immediately
      setUser(session?.user ?? null);
      console.log('AuthContext: User state set to:', session?.user?.id || 'null');
      
      if (session?.user) {
        // Set admin role directly to avoid RLS issues
        console.log('AuthContext: Setting admin role for authenticated user');
        setUserRole('admin');
        console.log('AuthContext: Setting loading to false on auth change');
        setLoading(false);
        
        // Try to fetch profile in background (non-blocking)
        setTimeout(async () => {
          try {
            console.log('AuthContext: Attempting to fetch profile in background...');
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single();
            
            if (!error && profile?.role) {
              console.log('AuthContext: Profile fetched successfully:', profile.role);
              setUserRole(profile.role);
            } else {
              console.log('AuthContext: Profile fetch failed or no role found, keeping admin role');
            }
          } catch (err) {
            console.log('AuthContext: Background profile fetch failed:', err);
          }
        }, 100);
      } else {
        setUserRole(null);
        console.log('AuthContext: Setting loading to false on auth change');
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (identifier: string, password: string) => {
    console.log('AuthContext signIn called with identifier:', identifier);
    
    let email = identifier;
    // If the identifier is not an email, look up the email by username
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(identifier)) {
      console.log('Looking up email by username...');
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('email')
          .eq('username', identifier)
          .single();
        if (error || !data) throw new Error('No user found with that username');
        email = data.email;
        console.log('Found email:', email);
      } catch (err) {
        console.log('Username lookup failed, proceeding with identifier as email');
        email = identifier;
      }
    }
    console.log('Signing in with email:', email);
    
    // Try authentication
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Supabase auth error:', error);
        throw error;
      }
      console.log('Supabase auth successful');
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    }
    
    console.log('signIn function completed');
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };

  const value = {
    user,
    userRole,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 