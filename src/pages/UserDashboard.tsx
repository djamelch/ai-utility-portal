
import { useState, useEffect } from 'react';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { DashboardTabs } from '@/components/dashboard/DashboardTabs';
import { useAuth } from '@/context/AuthContext';
import { PageLoadingWrapper } from '@/components/ui/PageLoadingWrapper';
import { AdminDashboardPreview } from '@/components/dashboard/AdminDashboardPreview';
import { Button } from '@/components/ui/button';
import { Shield, LayoutDashboard } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function UserDashboard() {
  const { isAdmin, isLoading } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'user' | 'admin'>(isAdmin ? 'user' : 'user');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Set default tab based on admin status
  useEffect(() => {
    if (isAdmin) {
      setSelectedTab('user');
    }
  }, [isAdmin]);
  
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
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="gap-2"
                    onClick={navigateToAdminDashboard}
                  >
                    <Shield className="h-4 w-4" />
                    Go to Admin Dashboard
                  </Button>
                )}
              </div>
            </MotionWrapper>
            
            <MotionWrapper animation="fadeIn" delay="delay-200">
              {isAdmin ? (
                // Show tabs for admin users
                <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as 'user' | 'admin')} className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger value="user">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Your Dashboard
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="user">
                    <DashboardTabs />
                  </TabsContent>
                </Tabs>
              ) : (
                // Show user dashboard and admin preview for regular users
                <>
                  <AdminDashboardPreview />
                  <DashboardTabs />
                </>
              )}
            </MotionWrapper>
          </div>
        </main>
        <Footer />
      </PageLoadingWrapper>
    </RequireAuth>
  );
}
