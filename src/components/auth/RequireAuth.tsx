
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
        <LoadingIndicator size={32} text="التحقق من الصلاحيات..." />
      </div>
    );
  }

  if (!user) {
    // توجيه إلى صفحة تسجيل الدخول، مع حفظ الموقع الحالي
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // التحقق من صلاحيات المسؤول - فقط المسؤولون يمكنهم الوصول إلى مسارات المسؤول
  if (requireAdmin && !isAdmin) {
    // المستخدم مسجل الدخول ولكنه ليس مسؤولاً، ونحن نتطلب وصول المسؤول
    console.log("Access denied: User is not admin but admin access is required");
    return <Navigate to="/" replace />;
  }

  // المستخدم مسجل الدخول (وهو مسؤول إذا كان مطلوبًا)
  return <>{children}</>;
}
