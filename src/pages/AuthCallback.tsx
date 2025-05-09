
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get auth from URL hash
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (data?.session) {
          // Successfully signed in, redirect to home
          navigate('/', { replace: true });
        } else {
          // No session found, redirect to auth page
          navigate('/auth', { replace: true });
        }
      } catch (error) {
        console.error('Error handling auth callback:', error);
        navigate('/auth', { replace: true });
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <LoadingIndicator size={32} text="Completing authentication..." />
      </div>
    </div>
  );
}
