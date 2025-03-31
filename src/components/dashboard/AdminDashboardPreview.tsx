
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Database, Shield, Users, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PromoteToAdmin } from '../admin/PromoteToAdmin';

export function AdminDashboardPreview() {
  const navigate = useNavigate();
  
  // Direct navigation handlers for each admin section
  const navigateToAdminAnalytics = () => navigate('/admin');
  const navigateToAdminTools = () => navigate('/admin/tools');
  const navigateToAdminUsers = () => navigate('/admin');
  const navigateToAdminSettings = () => navigate('/admin');
  const navigateToFullAdmin = () => navigate('/admin');
  
  return (
    <Card className="w-full border-dashed border-2 border-yellow-500 mb-8">
      <CardHeader className="bg-yellow-50 dark:bg-yellow-950/20">
        <CardTitle className="text-xl flex items-center gap-2">
          <Shield className="h-5 w-5 text-yellow-600" />
          Admin Dashboard Preview
        </CardTitle>
        <CardDescription>
          This is a preview of what the admin dashboard looks like. You need admin privileges to access the full dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="preview">
              <Shield className="h-4 w-4 mr-2" />
              Dashboard Preview
            </TabsTrigger>
            <TabsTrigger value="promote">
              <Shield className="h-4 w-4 mr-2" />
              Get Admin Access
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card 
                className="cursor-pointer hover:border-primary transition-colors" 
                onClick={navigateToAdminAnalytics}
              >
                <CardHeader className="p-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart className="h-4 w-4 text-primary" />
                    Analytics
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card 
                className="cursor-pointer hover:border-primary transition-colors" 
                onClick={navigateToAdminTools}
              >
                <CardHeader className="p-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Database className="h-4 w-4 text-green-600" />
                    Tools
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card 
                className="cursor-pointer hover:border-primary transition-colors" 
                onClick={navigateToAdminUsers}
              >
                <CardHeader className="p-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    Users
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card 
                className="cursor-pointer hover:border-primary transition-colors" 
                onClick={navigateToAdminSettings}
              >
                <CardHeader className="p-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="h-4 w-4 text-purple-600" />
                    Settings
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>
            
            <div className="flex justify-center mt-4">
              <Button 
                onClick={navigateToFullAdmin} 
                variant="outline"
                className="gap-2"
              >
                <Shield className="h-4 w-4" />
                Go to Admin Dashboard
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="promote" className="space-y-4">
            <div className="max-w-md mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Get Admin Access</CardTitle>
                  <CardDescription>
                    Promote your account to an administrator to access the full admin dashboard.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PromoteToAdmin />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
