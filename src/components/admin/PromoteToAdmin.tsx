
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
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
      
      console.log('Requesting admin promotion for user:', user.id);
      
      // Call the API route
      const response = await fetch('/api/promote-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });
      
      // First get response as text
      const responseText = await response.text();
      let data;
      
      try {
        // Try to parse the response as JSON
        data = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error('Error parsing response:', responseText);
        throw new Error('Failed to parse server response');
      }
      
      console.log('Admin promotion response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to promote to admin');
      }
      
      toast({
        title: 'Success!',
        description: 'You have been promoted to admin. The page will refresh shortly.',
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
