
import { useEffect } from 'react';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { DashboardTabs } from '@/components/dashboard/DashboardTabs';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PageLoadingWrapper } from '@/components/ui/PageLoadingWrapper';
import { AdminDashboardPreview } from '@/components/dashboard/AdminDashboardPreview';

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
      <PageLoadingWrapper isLoading={isLoading} loadingText="Loading dashboard...">
        <main className="flex-1 pt-24 pb-16">
          <div className="container max-w-screen-xl mx-auto px-4">
            <MotionWrapper animation="fadeIn">
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold">
                  Your Dashboard
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Manage your saved tools, reviews, and account settings
                </p>
              </div>
            </MotionWrapper>
            
            <MotionWrapper animation="fadeIn" delay="delay-200">
              {/* Admin Dashboard Preview */}
              <AdminDashboardPreview />
              
              {/* User Dashboard Content */}
              <DashboardTabs />
            </MotionWrapper>
          </div>
        </main>
      </PageLoadingWrapper>
    </RequireAuth>
  );
}
