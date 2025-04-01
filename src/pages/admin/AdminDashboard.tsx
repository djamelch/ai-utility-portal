
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
import { AdminBlogs } from './AdminBlogs';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  BarChart, Users, Settings, Database, LayoutDashboard, Shield,
  FileInput, ArrowLeft, Loader2, FileText
} from 'lucide-react';
import { PageLoadingWrapper } from '@/components/ui/PageLoadingWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('analytics');
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalTools: 0,
    totalClicks: 0,
    totalReviews: 0,
    totalBlogs: 0,
    admins: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    if (location.pathname.includes('/admin/tools')) {
      setActiveTab('tools');
    } else if (location.pathname.includes('/admin/users')) {
      setActiveTab('users');
    } else if (location.pathname.includes('/admin/settings')) {
      setActiveTab('settings');
    } else if (location.pathname.includes('/admin/blogs')) {
      setActiveTab('blogs');
    } else {
      setActiveTab('analytics');
    }
  }, [location.pathname]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoadingStats(true);
        
        // Fetch all stats separately to avoid type issues
        const { count: usersCount, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
          
        if (usersError) throw usersError;
        
        const { count: toolsCount, error: toolsError } = await supabase
          .from('tools')
          .select('*', { count: 'exact', head: true });
          
        if (toolsError) throw toolsError;
        
        const { count: reviewsCount, error: reviewsError } = await supabase
          .from('reviews')
          .select('*', { count: 'exact', head: true });
          
        if (reviewsError) throw reviewsError;
        
        // For blog posts, use a try-catch to handle potential errors gracefully
        let blogsCount = 0;
        try {
          // Since blog_posts table exists but may not be in types yet, we need to cast it
          const { data, error } = await supabase
            .from('blog_posts')
            .select('count', { count: 'exact', head: true }) as any;
            
          if (!error) {
            blogsCount = data?.length || 0;
          }
        } catch (error) {
          console.error('Error fetching blog posts count:', error);
          // Silently continue with blogsCount as 0
        }
        
        const { data: adminData, error: adminError } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'admin');
          
        if (adminError) throw adminError;
        
        const { data: totalClicksData, error: totalClicksError } = await supabase
          .from('tools')
          .select('click_count');
          
        if (totalClicksError) throw totalClicksError;
        
        const totalClicks = totalClicksData.reduce((sum, tool) => sum + (tool.click_count || 0), 0);
        
        setDashboardStats({
          totalUsers: usersCount || 0,
          totalTools: toolsCount || 0,
          totalReviews: reviewsCount || 0,
          totalBlogs: blogsCount,
          totalClicks: totalClicks,
          admins: adminData?.length || 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        toast({
          title: 'Error loading data',
          description: 'Unable to fetch dashboard statistics',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchDashboardStats();
  }, [toast]);

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
      case 'blogs':
        navigate('/admin/blogs');
        break;
      case 'analytics':
      default:
        navigate('/admin');
        break;
    }
  };

  return (
    <RequireAuth>
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
                  {isLoadingStats ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-sm text-muted-foreground">Total Tools</h3>
                          <Database className="h-4 w-4 text-primary" />
                        </div>
                        <p className="text-2xl font-bold mt-2">{dashboardStats.totalTools}</p>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-sm text-muted-foreground">Users</h3>
                          <Users className="h-4 w-4 text-indigo-500" />
                        </div>
                        <p className="text-2xl font-bold mt-2">{dashboardStats.totalUsers}</p>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-sm text-muted-foreground">Reviews</h3>
                          <BarChart className="h-4 w-4 text-green-500" />
                        </div>
                        <p className="text-2xl font-bold mt-2">{dashboardStats.totalReviews}</p>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-sm text-muted-foreground">Blog Posts</h3>
                          <FileText className="h-4 w-4 text-orange-500" />
                        </div>
                        <p className="text-2xl font-bold mt-2">{dashboardStats.totalBlogs}</p>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-sm text-muted-foreground">Total Clicks</h3>
                          <BarChart className="h-4 w-4 text-blue-500" />
                        </div>
                        <p className="text-2xl font-bold mt-2">{dashboardStats.totalClicks}</p>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-sm text-muted-foreground">Admins</h3>
                          <Shield className="h-4 w-4 text-purple-500" />
                        </div>
                        <p className="text-2xl font-bold mt-2">{dashboardStats.admins}</p>
                      </div>
                    </div>
                  )}
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
                  <TabsTrigger value="blogs">
                    <FileText className="h-4 w-4 mr-2" />
                    Blogs
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
                
                <TabsContent value="blogs">
                  <AdminBlogs />
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
