
import { useState } from 'react';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { DashboardTabs } from '@/components/dashboard/DashboardTabs';
import { useAuth } from '@/context/AuthContext';
import { PageLoadingWrapper } from '@/components/ui/PageLoadingWrapper';
import { AdminDashboardPreview } from '@/components/dashboard/AdminDashboardPreview';
import { Button } from '@/components/ui/button';
import { Shield, LayoutDashboard, Users, Database, BarChart, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminTools } from '@/pages/admin/AdminTools';
import { AdminUsers } from '@/pages/admin/AdminUsers';
import { AdminAnalytics } from '@/pages/admin/AdminAnalytics';
import { AdminSettings } from '@/pages/admin/AdminSettings';

export default function UserDashboard() {
  const { isAdmin, isLoading } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'user' | 'admin'>(isAdmin ? 'admin' : 'user');
  const [adminTab, setAdminTab] = useState('analytics');
  const navigate = useNavigate();
  
  // Direct navigation handlers for admin sections
  const navigateToAdminAnalytics = () => {
    navigate('/admin');
  };
  
  const navigateToAdminTools = () => {
    navigate('/admin/tools');
  };
  
  const navigateToAdminUsers = () => {
    navigate('/admin/users');
  };
  
  const navigateToAdminSettings = () => {
    navigate('/admin/settings');
  };
  
  return (
    <RequireAuth>
      <PageLoadingWrapper isLoading={isLoading} loadingText="Loading dashboard...">
        <main className="flex-1 pt-24 pb-16">
          <div className="container max-w-screen-xl mx-auto px-4">
            <MotionWrapper animation="fadeIn">
              <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">
                    Dashboard
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    Manage your account, tools, and settings
                  </p>
                </div>
                
                {isAdmin && (
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="gap-2"
                    onClick={() => navigate('/admin')}
                  >
                    <Shield className="h-4 w-4" />
                    Go to Full Admin Dashboard
                  </Button>
                )}
              </div>
            </MotionWrapper>
            
            <MotionWrapper animation="fadeIn" delay="delay-200">
              {isAdmin ? (
                // Show both user and admin tabs for admin users
                <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as 'user' | 'admin')} className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger value="user">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Your Dashboard
                    </TabsTrigger>
                    <TabsTrigger value="admin">
                      <Shield className="h-4 w-4 mr-2" />
                      Admin Dashboard
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="user">
                    <DashboardTabs />
                  </TabsContent>
                  
                  <TabsContent value="admin">
                    <Tabs 
                      value={adminTab} 
                      onValueChange={setAdminTab}
                      className="w-full"
                    >
                      <TabsList className="mb-6">
                        <TabsTrigger value="analytics" onClick={navigateToAdminAnalytics}>
                          <BarChart className="h-4 w-4 mr-2" />
                          Analytics
                        </TabsTrigger>
                        <TabsTrigger value="tools" onClick={navigateToAdminTools}>
                          <Database className="h-4 w-4 mr-2" />
                          Tools
                        </TabsTrigger>
                        <TabsTrigger value="users" onClick={navigateToAdminUsers}>
                          <Users className="h-4 w-4 mr-2" />
                          Users
                        </TabsTrigger>
                        <TabsTrigger value="settings" onClick={navigateToAdminSettings}>
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </TabsTrigger>
                      </TabsList>
                      
                      {/* We've replaced the inline content with redirects to the full Admin Dashboard */}
                      <TabsContent value="analytics">
                        <div className="text-center py-8">
                          <p className="mb-4">Redirecting to the full Admin Dashboard for complete analytics view...</p>
                          <Button onClick={navigateToAdminAnalytics}>
                            Go to Analytics Dashboard
                          </Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="tools">
                        <div className="text-center py-8">
                          <p className="mb-4">Redirecting to the full Admin Dashboard for complete tools management...</p>
                          <Button onClick={navigateToAdminTools}>
                            Go to Tools Management
                          </Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="users">
                        <div className="text-center py-8">
                          <p className="mb-4">Redirecting to the full Admin Dashboard for complete user management...</p>
                          <Button onClick={navigateToAdminUsers}>
                            Go to User Management
                          </Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="settings">
                        <div className="text-center py-8">
                          <p className="mb-4">Redirecting to the full Admin Dashboard for complete site settings...</p>
                          <Button onClick={navigateToAdminSettings}>
                            Go to Site Settings
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </TabsContent>
                </Tabs>
              ) : (
                // Show only user dashboard and admin preview for regular users
                <>
                  <AdminDashboardPreview />
                  <DashboardTabs />
                </>
              )}
            </MotionWrapper>
          </div>
        </main>
      </PageLoadingWrapper>
    </RequireAuth>
  );
}
