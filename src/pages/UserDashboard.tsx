
import { useState, useEffect } from 'react';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { DashboardTabs } from '@/components/dashboard/DashboardTabs';
import { useAuth } from '@/context/AuthContext';
import { PageLoadingWrapper } from '@/components/ui/PageLoadingWrapper';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { UserRoleBadge } from '@/components/admin/users/UserRoleBadge';
import { Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AdminDashboardPreview } from '@/components/dashboard/AdminDashboardPreview';

export default function UserDashboard() {
  const { isAdmin, isLoading, user } = useAuth();
  const navigate = useNavigate();
  
  // Debug information
  console.log("UserDashboard render:", { isAdmin, user });
  
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
                  <div className="self-start flex flex-col sm:flex-row gap-3">
                    <UserRoleBadge isAdmin={true} />
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="gap-2"
                      onClick={() => navigate('/admin')}
                    >
                      Admin Dashboard
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </MotionWrapper>
            
            {!isAdmin && (
              <MotionWrapper animation="fadeIn" delay="delay-100">
                <AdminDashboardPreview />
              </MotionWrapper>
            )}
            
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
