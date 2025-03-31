
import { useState, useEffect } from 'react';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { DashboardTabs } from '@/components/dashboard/DashboardTabs';
import { useAuth } from '@/context/AuthContext';
import { PageLoadingWrapper } from '@/components/ui/PageLoadingWrapper';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { UserRoleBadge } from '@/components/admin/users/UserRoleBadge';

export default function UserDashboard() {
  const { isAdmin, isLoading, user } = useAuth();
  const navigate = useNavigate();
  
  // Navigation handler for admin dashboard
  const navigateToAdminDashboard = () => {
    navigate('/admin');
  };
  
  return (
    <RequireAuth>
      <PageLoadingWrapper isLoading={isLoading} loadingText="Loading dashboard...">
        <Navbar />
        <main className="flex-1 pt-24 pb-16">
          <div className="container max-w-screen-xl mx-auto px-4">
            <MotionWrapper animation="fadeIn">
              <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">
                    User Dashboard
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    Manage your account, saved tools, and reviews
                  </p>
                </div>
                
                {isAdmin && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <UserRoleBadge isAdmin={true} className="self-start" />
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="gap-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                      onClick={navigateToAdminDashboard}
                    >
                      <Shield className="h-4 w-4" />
                      Go to Admin Dashboard
                    </Button>
                  </div>
                )}
              </div>
            </MotionWrapper>
            
            <MotionWrapper animation="fadeIn" delay="delay-200">
              <DashboardTabs />
            </MotionWrapper>
          </div>
        </main>
        <Footer />
      </PageLoadingWrapper>
    </RequireAuth>
  );
}
