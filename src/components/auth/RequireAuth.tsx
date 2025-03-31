
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';
import { useEffect } from 'react';
import { toast } from 'sonner';

type RequireAuthProps = {
  children: React.ReactNode;
  requireAdmin?: boolean;
};

export function RequireAuth({ children, requireAdmin = false }: RequireAuthProps) {
  const { user, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  // Debug information
  console.log("RequireAuth check:", { 
    user, 
    isAdmin, 
    requireAdmin, 
    pathname: location.pathname,
    state: location.state
  });
  
  useEffect(() => {
    if (!isLoading && requireAdmin && !isAdmin) {
      toast.error("You need admin privileges to access this page");
    }
  }, [isLoading, requireAdmin, isAdmin]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingIndicator size={32} text="Authenticating..." />
      </div>
    );
  }

  // If not logged in, redirect to auth page
  if (!user) {
    console.log("User not authenticated, redirecting to /auth");
    // Redirect to the auth page, but save the current location
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If admin is required but user is not an admin
  if (requireAdmin && !isAdmin) {
    console.log("User is not an admin but trying to access admin page");
    // User is logged in but not an admin, and we require admin access
    return <Navigate to="/" replace />;
  }

  // User is logged in (and is admin if required)
  return <>{children}</>;
}
