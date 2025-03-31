import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Define the UserProfile type for our profiles table
interface UserProfile {
  id: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{error: string | null}>;
  signInWithGoogle: () => Promise<{error: string | null}>;
  signUp: (email: string, password: string) => Promise<{error: string | null}>;
  signOut: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for:', userId);
      
      // Use RPC call instead of direct query to avoid infinite recursion
      const { data, error } = await supabase.rpc('get_profile_by_id', {
        user_id: userId
      });
      
      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      if (data) {
        setProfile(data as UserProfile);
        return;
      }

      // Profile doesn't exist, create one
      // CHANGED: Make all new users admins by default
      const role = 'admin'; // Changed from conditional to always be 'admin'
      
      // Create the user profile using RPC
      const { error: createError } = await supabase.rpc('create_new_profile', {
        user_id: userId,
        user_role: role
      });
      
      if (createError) {
        throw createError;
      }
      
      // Set the profile in state
      setProfile({
        id: userId,
        role: role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error handling user profile:', err);
      // Fallback to create a mock profile for authentication to continue working
      setProfile({
        id: userId,
        role: 'admin', // Changed from 'user' to 'admin' for fallback too
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
  };

  useEffect(() => {
    // Set loading state
    setIsLoading(true);

    // First, set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Use setTimeout to defer profile fetching to avoid recursion
          // This is important to prevent the infinite recursion issue
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        setError(error.message);
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
      }
      return { error: error ? error.message : null };
    } catch (error) {
      console.error('Error signing in:', error);
      const errorMsg = 'An unexpected error occurred';
      setError(errorMsg);
      toast({
        title: "Sign in failed",
        description: errorMsg,
        variant: "destructive",
      });
      return { error: errorMsg };
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        setError(error.message);
        toast({
          title: "Google sign in failed",
          description: error.message,
          variant: "destructive",
        });
      }
      return { error: error ? error.message : null };
    } catch (error) {
      console.error('Error signing in with Google:', error);
      const errorMsg = 'An unexpected error occurred';
      setError(errorMsg);
      toast({
        title: "Google sign in failed",
        description: errorMsg,
        variant: "destructive",
      });
      return { error: errorMsg };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        setError(error.message);
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sign up successful",
          description: "Please check your email to confirm your account",
        });
      }
      return { error: error ? error.message : null };
    } catch (error) {
      console.error('Error signing up:', error);
      const errorMsg = 'An unexpected error occurred';
      setError(errorMsg);
      toast({
        title: "Sign up failed",
        description: errorMsg,
        variant: "destructive",
      });
      return { error: errorMsg };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        toast({
          title: "Sign out failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Sign out failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const isAdmin = !!profile && profile.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        isAdmin,
        isLoading,
        signIn,
        signInWithGoogle,
        signUp,
        signOut,
        error,
      }}
    >
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
