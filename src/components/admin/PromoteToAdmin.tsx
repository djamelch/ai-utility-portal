
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, Loader2 } from 'lucide-react';

export function PromoteToAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, profile } = useAuth();
  
  // Don't show the button if user is already an admin
  if (profile?.role === 'admin') {
    return null;
  }

  const promoteToAdmin = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Update the role to admin in the profiles table
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', user.id);
      
      if (error) {
        throw error;
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
          Promote to Admin
        </>
      )}
    </Button>
  );
}
