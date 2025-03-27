
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, Loader2, AlertCircle } from 'lucide-react';

export function PromoteToAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const [adminExists, setAdminExists] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const { toast } = useToast();
  const { user, profile } = useAuth();
  
  // Check if any admin users already exist
  useEffect(() => {
    const checkIfAdminExists = async () => {
      try {
        setIsCheckingAdmin(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'admin')
          .limit(1);
        
        if (error) {
          throw error;
        }
        
        // If any admin users exist and the current user is not an admin
        setAdminExists(data && data.length > 0);
      } catch (error) {
        console.error('Error checking admin status:', error);
      } finally {
        setIsCheckingAdmin(false);
      }
    };
    
    checkIfAdminExists();
  }, []);
  
  // Don't show the button if user is already an admin
  if (profile?.role === 'admin') {
    return null;
  }

  // Don't show button if another admin already exists
  if (adminExists) {
    return (
      <div className="flex items-center space-x-2 text-sm text-muted-foreground p-2 border rounded">
        <AlertCircle className="h-4 w-4 text-amber-500" />
        <span>Admin position is already filled</span>
      </div>
    );
  }

  const promoteToAdmin = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Check once more if an admin already exists before proceeding
      const { data, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin')
        .limit(1);
      
      if (checkError) throw checkError;
      
      if (data && data.length > 0) {
        toast({
          title: 'Admin already exists',
          description: 'Someone else has already been promoted to admin.',
          variant: 'destructive',
        });
        setAdminExists(true);
        return;
      }
      
      // Call the Supabase Edge Function directly
      const { error } = await supabase.functions.invoke('promote-admin', {
        body: { userId: user.id },
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to promote to admin');
      }
      
      toast({
        title: 'Success!',
        description: 'You have been promoted to admin. Please refresh the page.',
        variant: 'default',
      });
      
      // Refresh the page after a short delay to update the auth context
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error: any) {
      console.error('Error promoting to admin:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to promote to admin',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAdmin) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        <span className="text-sm">Checking admin status...</span>
      </div>
    );
  }
  
  return (
    <Button 
      variant="outline" 
      className="gap-2 w-full"
      onClick={promoteToAdmin}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Promoting...
        </>
      ) : (
        <>
          <ShieldCheck className="h-4 w-4 text-purple-500" />
          Become First Admin
        </>
      )}
    </Button>
  );
}
