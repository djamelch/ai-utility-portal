
"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

type RequireAuthProps = {
  children: React.ReactNode;
  requireAdmin?: boolean;
};

export function RequireAuth({ children, requireAdmin = false }: RequireAuthProps) {
  const { user, isLoading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Redirect to the auth page, but save the current location
        router.push(`/auth?from=${encodeURIComponent(pathname || '/')}`);
      } else if (requireAdmin && !isAdmin) {
        // User is logged in but not an admin, and we require admin access
        router.push('/');
      }
      setIsChecking(false);
    }
  }, [user, isLoading, isAdmin, requireAdmin, router, pathname]);

  if (isLoading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requireAdmin && !isAdmin) {
    return null;
  }

  // User is logged in (and is admin if required)
  return <>{children}</>;
}
