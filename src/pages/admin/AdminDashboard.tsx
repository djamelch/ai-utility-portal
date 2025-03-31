
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { AdminTools } from './AdminTools';
import { AdminUsers } from './AdminUsers';
import { AdminAnalytics } from './AdminAnalytics';
import { AdminSettings } from './AdminSettings';
import { useAuth } from '@/context/AuthContext';
import { 
  BarChart, Users, Settings, Database, LayoutDashboard, Shield,
  FileInput, ArrowLeft
} from 'lucide-react';
import { PageLoadingWrapper } from '@/components/ui/PageLoadingWrapper';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('analytics');
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Set the active tab based on the current URL
  useEffect(() => {
    if (location.pathname.includes('/admin/tools')) {
      setActiveTab('tools');
    } else if (location.pathname.includes('/admin/users')) {
      setActiveTab('users');
    } else if (location.pathname.includes('/admin/settings')) {
      setActiveTab('settings');
    } else {
      setActiveTab('analytics');
    }
  }, [location.pathname]);

  // Redirect non-admin users
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/dashboard');
    }
  }, [isAdmin, isLoading, navigate]);
  
  // Direct navigation handlers for each tab
  const navigateToTab = (tab: string) => {
    setActiveTab(tab);
    
    switch(tab) {
      case 'tools':
        navigate('/admin/tools');
        break;
      case 'users':
        navigate('/admin/users');
        break;
      case 'settings':
        navigate('/admin/settings');
        break;
      case 'analytics':
      default:
        navigate('/admin');
        break;
    }
  };

  return (
    <RequireAuth requireAdmin={true}>
      <PageLoadingWrapper 
        isLoading={isLoading} 
        loadingText="Loading admin dashboard..."
        variant="progress"
      >
        <Navbar />
        
        <main className="flex-1 pt-24 pb-16">
          <div className="container max-w-screen-xl mx-auto px-4">
            <MotionWrapper animation="fadeIn">
              <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">
                    Admin Dashboard
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    Manage your AI tools database, users, and site settings
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild variant="outline" size="lg" className="gap-2">
                    <Link to="/dashboard">
                      <LayoutDashboard className="h-4 w-4" />
                      User Dashboard
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" size="lg" className="gap-2">
                    <Link to="/admin/csv-import">
                      <FileInput className="h-4 w-4" />
                      CSV Import
                    </Link>
                  </Button>
                </div>
              </div>
            </MotionWrapper>
            
            <MotionWrapper animation="fadeIn" delay="delay-200">
              <Tabs 
                defaultValue="analytics" 
                value={activeTab} 
                onValueChange={navigateToTab}
                className="w-full"
              >
                <TabsList className="mb-6">
                  <TabsTrigger value="analytics">
                    <BarChart className="h-4 w-4 mr-2" />
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger value="tools">
                    <Database className="h-4 w-4 mr-2" />
                    Tools
                  </TabsTrigger>
                  <TabsTrigger value="users">
                    <Users className="h-4 w-4 mr-2" />
                    Users
                  </TabsTrigger>
                  <TabsTrigger value="settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="analytics">
                  <AdminAnalytics />
                </TabsContent>
                
                <TabsContent value="tools">
                  <AdminTools />
                </TabsContent>
                
                <TabsContent value="users">
                  <AdminUsers />
                </TabsContent>
                
                <TabsContent value="settings">
                  <AdminSettings />
                </TabsContent>
              </Tabs>
            </MotionWrapper>
          </div>
        </main>
        
        <Footer />
      </PageLoadingWrapper>
    </RequireAuth>
  );
}
