
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Database, Shield, Users, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PromoteToAdmin } from '../admin/PromoteToAdmin';
import { useAuth } from '@/context/AuthContext';

export function AdminDashboardPreview() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  // إذا كان المستخدم مشرفًا بالفعل، لا تعرض المعاينة
  if (isAdmin) {
    return null;
  }
  
  // دوال التوجيه المباشر لكل قسم من أقسام الإدارة
  const navigateToAdminAnalytics = () => navigate('/admin');
  const navigateToAdminTools = () => navigate('/admin/tools');
  const navigateToAdminUsers = () => navigate('/admin/users');
  const navigateToAdminSettings = () => navigate('/admin/settings');
  const navigateToFullAdmin = () => navigate('/admin');
  
  return (
    <Card className="w-full border-dashed border-2 border-yellow-500 mb-8">
      <CardHeader className="bg-yellow-50 dark:bg-yellow-950/20">
        <CardTitle className="text-xl flex items-center gap-2">
          <Shield className="h-5 w-5 text-yellow-600" />
          معاينة لوحة تحكم المشرف
        </CardTitle>
        <CardDescription>
          هذه معاينة لما تبدو عليه لوحة تحكم المشرف. تحتاج إلى امتيازات المشرف للوصول إلى اللوحة الكاملة.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="preview">
              <Shield className="h-4 w-4 mr-2" />
              معاينة اللوحة
            </TabsTrigger>
            <TabsTrigger value="promote">
              <Shield className="h-4 w-4 mr-2" />
              الحصول على صلاحيات المشرف
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card 
                className="cursor-not-allowed opacity-70 hover:border-primary transition-colors" 
              >
                <CardHeader className="p-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart className="h-4 w-4 text-primary" />
                    التحليلات
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card 
                className="cursor-not-allowed opacity-70 hover:border-primary transition-colors" 
              >
                <CardHeader className="p-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Database className="h-4 w-4 text-green-600" />
                    الأدوات
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card 
                className="cursor-not-allowed opacity-70 hover:border-primary transition-colors" 
              >
                <CardHeader className="p-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    المستخدمين
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card 
                className="cursor-not-allowed opacity-70 hover:border-primary transition-colors" 
              >
                <CardHeader className="p-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="h-4 w-4 text-purple-600" />
                    الإعدادات
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>
            
            <div className="flex justify-center mt-4">
              <Button 
                variant="outline"
                className="gap-2 cursor-not-allowed opacity-70"
                disabled
              >
                <Shield className="h-4 w-4" />
                يتطلب صلاحيات المشرف
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="promote" className="space-y-4">
            <div className="max-w-md mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>الحصول على صلاحيات المشرف</CardTitle>
                  <CardDescription>
                    قم بترقية حسابك إلى مشرف للوصول إلى لوحة تحكم المشرف الكاملة.
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
