import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type User = {
  id: string;
  email?: string;
  role?: string;
};

type Profile = {
  id: string;
  role: string;
};

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any; data: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function getSession() {
      try {
        setIsLoading(true);
        
        // Get session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (sessionData?.session) {
          const { data: userData, error: userError } = await supabase.auth.getUser();
          
          if (userError) {
            throw userError;
          }
          
          if (userData.user) {
            // Get profile to check role
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userData.user.id)
              .single();
              
            if (profileError && profileError.code !== 'PGRST116') {
              console.error("Error fetching profile:", profileError);
            }
            
            const userWithRole = {
              id: userData.user.id,
              email: userData.user.email,
              role: profileData?.role || 'user'
            };
            
            setUser(userWithRole);
            setIsAdmin(userWithRole.role === 'admin');
            setProfile(profileData);
            console.log("User authenticated:", userWithRole);
            console.log("Is admin:", userWithRole.role === 'admin');
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setUser(null);
        setIsAdmin(false);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    }

    getSession();

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        try {
          // Get profile to check role
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError && profileError.code !== 'PGRST116') {
            console.error("Error fetching profile:", profileError);
          }
          
          const userWithRole = {
            id: session.user.id,
            email: session.user.email,
            role: profileData?.role || 'user'
          };
          
          setUser(userWithRole);
          setIsAdmin(userWithRole.role === 'admin');
          setProfile(profileData);
          console.log("User signed in:", userWithRole);
          console.log("Is admin:", userWithRole.role === 'admin');
        } catch (error) {
          console.error("Error during auth state change:", error);
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setIsAdmin(false);
        setProfile(null);
        console.log("User signed out");
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast({
          title: "Error signing in",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }
      
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      
      return { error: null };
    } catch (error: any) {
      console.error("Error signing in:", error);
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        toast({
          title: "Error signing up",
          description: error.message,
          variant: "destructive",
        });
        return { error, data: null };
      }
      
      // Create a profile record with the default role 'user'
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { id: data.user.id, role: 'user' }
          ]);
          
        if (profileError) {
          console.error("Error creating user profile:", profileError);
        }
      }
      
      toast({
        title: "Account created!",
        description: "Please check your email to confirm your account.",
      });
      
      return { error: null, data };
    } catch (error: any) {
      console.error("Error signing up:", error);
      toast({
        title: "Error signing up",
        description: error.message,
        variant: "destructive",
      });
      return { error, data: null };
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAdmin(false);
      setProfile(null);
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        toast({
          title: "Error resetting password",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }
      
      toast({
        title: "Password reset email sent",
        description: "Please check your email for instructions to reset your password.",
      });
      
      return { error: null };
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast({
        title: "Error resetting password",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  // Sign in with Google function
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        toast({
          title: "Error signing in with Google",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }
      
      return { error: null };
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      toast({
        title: "Error signing in with Google",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const value = {
    user,
    profile,
    isAdmin,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
