
import { useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { DashboardTabs } from '@/components/dashboard/DashboardTabs';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function UserDashboard() {
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect admin users to the admin dashboard
  useEffect(() => {
    if (!isLoading && isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <RequireAuth>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        
        <main className="flex-1 pt-24 pb-16">
          <div className="container max-w-screen-xl mx-auto px-4">
            <MotionWrapper animation="fadeIn">
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold">
                  Your Dashboard
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Manage your saved tools, reviews, and personal settings
                </p>
              </div>
            </MotionWrapper>
            
            <MotionWrapper animation="fadeIn" delay="delay-200">
              <DashboardTabs />
            </MotionWrapper>
          </div>
        </main>
        
        <Footer />
      </div>
    </RequireAuth>
  );
}
