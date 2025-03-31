
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PromoteToAdmin } from '@/components/admin/PromoteToAdmin';

export function ProfileTab() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>إعدادات الملف الشخصي</CardTitle>
        <CardDescription>
          إدارة إعدادات حسابك وتفضيلاتك
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">معلومات الحساب</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">البريد الإلكتروني</label>
                <div className="mt-1 p-2 border rounded bg-muted/30">
                  {user?.email}
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">إجراءات الحساب</h3>
            <div className="space-y-4">
              <div>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/auth')}
                  className="w-full sm:w-auto"
                >
                  تحديث كلمة المرور
                </Button>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-medium mb-4">خيارات المطور</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  انقر على الزر أدناه لترقية حسابك إلى حساب مشرف. سيمنحك هذا وصولاً إلى لوحة تحكم المشرف.
                </p>
                <PromoteToAdmin />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
