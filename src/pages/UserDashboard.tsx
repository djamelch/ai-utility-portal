
import { useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { DashboardTabs } from '@/components/dashboard/DashboardTabs';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PageLoadingWrapper } from '@/components/ui/PageLoadingWrapper';

export default function UserDashboard() {
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect admin users to the admin dashboard
  useEffect(() => {
    if (!isLoading && isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, isLoading, navigate]);

  return (
    <RequireAuth>
      <PageLoadingWrapper isLoading={isLoading} loadingText="جاري تحميل لوحة التحكم...">
        <main className="flex-1 pt-24 pb-16">
          <div className="container max-w-screen-xl mx-auto px-4">
            <MotionWrapper animation="fadeIn">
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold">
                  لوحة التحكم الخاصة بك
                </h1>
                <p className="mt-2 text-muted-foreground">
                  إدارة أدواتك المحفوظة، والتقييمات، وإعدادات الحساب
                </p>
              </div>
            </MotionWrapper>
            
            <MotionWrapper animation="fadeIn" delay="delay-200">
              <DashboardTabs />
            </MotionWrapper>
          </div>
        </main>
      </PageLoadingWrapper>
    </RequireAuth>
  );
}
