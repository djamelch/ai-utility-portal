
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
  BarChart, Users, Settings, Database, LayoutDashboard
} from 'lucide-react';
import { PageLoadingWrapper } from '@/components/ui/PageLoadingWrapper';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('analytics');
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes('/admin/tools')) {
      setActiveTab('tools');
    } else if (location.pathname === '/admin') {
      setActiveTab('analytics');
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/dashboard');
    }
  }, [isAdmin, isLoading, navigate]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    if (value === 'tools') {
      navigate('/admin/tools');
    } else {
      navigate('/admin');
    }
  };

  return (
    <RequireAuth requireAdmin={true}>
      <PageLoadingWrapper 
        isLoading={isLoading} 
        loadingText="Loading admin dashboard..."
        variant="progress"
      >
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
                
                <Button asChild variant="outline" size="lg" className="gap-2">
                  <Link to="/dashboard">
                    <LayoutDashboard className="h-4 w-4" />
                    Go to User Dashboard
                  </Link>
                </Button>
              </div>
            </MotionWrapper>
            
            <MotionWrapper animation="fadeIn" delay="delay-200">
              <Tabs 
                defaultValue="analytics" 
                value={activeTab} 
                onValueChange={handleTabChange}
                className="w-full"
              >
                <TabsList className="mb-6">
                  <TabsTrigger value="analytics" onClick={() => navigate('/admin')}>
                    <BarChart className="h-4 w-4 mr-2" />
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger value="tools" onClick={() => navigate('/admin/tools')}>
                    <Database className="h-4 w-4 mr-2" />
                    Tools
                  </TabsTrigger>
                  <TabsTrigger value="users" onClick={() => navigate('/admin')}>
                    <Users className="h-4 w-4 mr-2" />
                    Users
                  </TabsTrigger>
                  <TabsTrigger value="settings" onClick={() => navigate('/admin')}>
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
      </PageLoadingWrapper>
    </RequireAuth>
  );
}
