
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { CsvTemplateDownloader } from '@/components/admin/CsvTemplateDownloader';
import { ImageProcessor } from '@/components/admin/ImageProcessor';
import { AlertCircle, Database, Upload, Settings, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTools: 0,
    totalReviews: 0,
    totalFavorites: 0,
  });

  // Check if user is authenticated and admin
  useEffect(() => {
    const checkUserStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }
      
      // Here you would check if the user has admin rights
      // For simplicity, we'll just check if they're authenticated
      setIsAdmin(true);
      setIsLoading(false);
      
      // Fetch stats
      fetchStats();
    };
    
    checkUserStatus();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      // Get tool count
      const { count: toolCount, error: toolError } = await supabase
        .from('tools')
        .select('*', { count: 'exact', head: true });
      
      if (toolError) throw toolError;
      
      // Get review count
      const { count: reviewCount, error: reviewError } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true });
      
      if (reviewError) throw reviewError;
      
      // Get favorites count
      const { count: favoriteCount, error: favoriteError } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true });
      
      if (favoriteError) throw favoriteError;
      
      setStats({
        totalTools: toolCount || 0,
        totalReviews: reviewCount || 0,
        totalFavorites: favoriteCount || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

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

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-16">
          <div className="container-wide">
            <MotionWrapper animation="fadeIn">
              <div className="text-center p-8">
                <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
                <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                <p className="text-muted-foreground mb-6">
                  You need to be logged in as an admin to access this page.
                </p>
                <Button onClick={() => navigate('/')}>
                  Return to Home
                </Button>
              </div>
            </MotionWrapper>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container-wide">
          <MotionWrapper animation="fadeIn">
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  Admin Dashboard
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Manage your AI tools database and site settings
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => navigate('/admin/csv-import')}>
                  <Upload className="mr-2 h-4 w-4" />
                  Import CSV
                </Button>
                <CsvTemplateDownloader />
              </div>
            </div>
          </MotionWrapper>
          
          <MotionWrapper animation="fadeIn" delay="delay-200">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Tools</h3>
                <p className="text-3xl font-bold">{stats.totalTools}</p>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Reviews</h3>
                <p className="text-3xl font-bold">{stats.totalReviews}</p>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Favorites</h3>
                <p className="text-3xl font-bold">{stats.totalFavorites}</p>
              </Card>
            </div>
            
            {/* Admin Tabs */}
            <Tabs defaultValue="tools" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="tools">
                  <Database className="h-4 w-4 mr-2" />
                  Data Management
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="tools" className="space-y-6">
                <ImageProcessor />
                
                <Card className="p-6">
                  <h3 className="text-lg font-medium mb-4">Database Management</h3>
                  <div className="grid gap-4">
                    <Button 
                      variant="outline" 
                      className="justify-start" 
                      onClick={() => navigate('/admin/csv-import')}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Import Tools from CSV
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => navigate('/tools')}
                    >
                      <Database className="mr-2 h-4 w-4" />
                      View All Tools
                    </Button>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings">
                <Card className="p-6">
                  <h3 className="text-lg font-medium mb-4">Site Settings</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure your site settings and preferences
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Site Name
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-md border border-input px-3 py-2"
                        defaultValue="AI Tools Directory"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Meta Description
                      </label>
                      <textarea
                        className="w-full rounded-md border border-input px-3 py-2"
                        rows={3}
                        defaultValue="Discover the best AI-powered tools for every need"
                      />
                    </div>
                    
                    <div className="pt-2">
                      <Button>Save Settings</Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </MotionWrapper>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
