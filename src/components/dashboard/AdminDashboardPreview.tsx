
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Database, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PromoteToAdmin } from '../admin/PromoteToAdmin';

export function AdminDashboardPreview() {
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
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart className="h-4 w-4 text-primary" />
                    Analytics
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Database className="h-4 w-4 text-green-600" />
                    Tools
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    Users
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-4 w-4 text-purple-600" />
                    Access
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>
            
            <div className="flex justify-center mt-4">
              <Button asChild variant="outline">
                <Link to="/admin">
                  <Shield className="h-4 w-4 mr-2" />
                  Go to Admin Dashboard
                </Link>
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
