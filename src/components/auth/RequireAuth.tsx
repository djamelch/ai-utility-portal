
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';

type RequireAuthProps = {
  children: React.ReactNode;
  requireAdmin?: boolean;
};

export function RequireAuth({ children, requireAdmin = false }: RequireAuthProps) {
  const { user, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingIndicator size={32} text="Authenticating..." />
      </div>
    );
  }

  if (!user) {
    // Redirect to the auth page, but save the current location
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Re-enable admin check - only admins can access admin routes
  if (requireAdmin && !isAdmin) {
    // User is logged in but not an admin, and we require admin access
    return <Navigate to="/" replace />;
  }

  // User is logged in (and is admin if required)
  return <>{children}</>;
}
