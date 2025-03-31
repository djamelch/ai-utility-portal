
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useLocation, Link } from 'react-router-dom';
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
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [stats, setStats] = useState({
    toolsCount: 0,
    usersCount: 0,
    reviewsCount: 0,
    adminsCount: 0
  });
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

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          { count: toolsCount },
          { count: usersCount },
          { count: reviewsCount },
          { count: adminsCount }
        ] = await Promise.all([
          supabase.from('tools').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('reviews').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true })
            .eq('role', 'admin')
        ]);
        
        setStats({
          toolsCount: toolsCount || 0,
          usersCount: usersCount || 0,
          reviewsCount: reviewsCount || 0,
          adminsCount: adminsCount || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };
    
    fetchStats();
  }, []);

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
            <Card className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border-none shadow-md">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm text-muted-foreground">Total Tools</h3>
                      <Database className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-2xl font-bold mt-2">{stats.toolsCount}</p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm text-muted-foreground">Users</h3>
                      <Users className="h-4 w-4 text-indigo-500" />
                    </div>
                    <p className="text-2xl font-bold mt-2">{stats.usersCount}</p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm text-muted-foreground">Reviews</h3>
                      <BarChart className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold mt-2">{stats.reviewsCount}</p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm text-muted-foreground">Admins</h3>
                      <Shield className="h-4 w-4 text-purple-500" />
                    </div>
                    <p className="text-2xl font-bold mt-2">{stats.adminsCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
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
  );
}
