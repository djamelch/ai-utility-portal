
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { LoadingPage } from '@/components/ui/loading-page';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Authenticating...');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get auth from URL hash
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setStatus('Authentication failed');
          throw error;
        }
        
        if (data?.session) {
          setStatus('Authentication successful');
          // Successfully signed in, redirect to home
          navigate('/', { replace: true });
        } else {
          setStatus('No session found');
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
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <LoadingPage />
        <p className="text-lg mt-4">{status}</p>
      </div>
    </div>
  );
}
