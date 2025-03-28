
import { useState, useEffect } from 'react';
import { PageWrapper } from "@/components/layout/PageWrapper";
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { DashboardTabs } from '@/components/dashboard/DashboardTabs';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function UserDashboard() {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate loading time or actual data fetching
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Redirect admin users to the admin dashboard
  useEffect(() => {
    if (!authLoading && isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, authLoading, navigate]);

  return (
    <PageWrapper isLoading={authLoading || pageLoading}>
      <div className="pt-24 pb-16">
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
      </div>
    </PageWrapper>
  );
}
