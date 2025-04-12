
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { 
  UserCheck, UserPlus, Shield, Loader2, Mail, Lock, AlertCircle
} from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const newUserSchema = z.object({
  email: z.string().email({ message: "البريد الإلكتروني غير صالح" }),
  password: z.string().min(6, { message: "يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل" }),
  makeAdmin: z.boolean().default(false),
});

type NewUserFormValues = z.infer<typeof newUserSchema>;

export function AdminNewUser() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [enableAdminCreation, setEnableAdminCreation] = useState(false);

  const form = useForm<NewUserFormValues>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {
      email: '',
      password: '',
      makeAdmin: false,
    },
  });

  const handleEnableAdminCreation = async () => {
    setEnableAdminCreation(!enableAdminCreation);
    
    toast({
      title: enableAdminCreation ? "تم تعطيل إنشاء المشرفين" : "تم تفعيل إنشاء المشرفين",
      description: enableAdminCreation ? 
        "لن يتمكن المستخدمون الجدد من أن يكونوا مشرفين" : 
        "يمكنك الآن إنشاء مستخدمين جدد كمشرفين",
    });
  };

  const onSubmit = async (data: NewUserFormValues) => {
    try {
      setIsLoading(true);
      
      // Create the user with email and password
      const { data: userData, error: signUpError } = await supabase.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true // Skip email confirmation
      });
      
      if (signUpError) throw signUpError;
      if (!userData.user) throw new Error("فشل إنشاء المستخدم");
      
      const userId = userData.user.id;
      
      // If makeAdmin is true and admin creation is enabled, set the user's role to admin
      if (data.makeAdmin && enableAdminCreation) {
        const { error: roleError } = await supabase
          .from('profiles')
          .upsert({
            id: userId,
            role: 'admin',
            updated_at: new Date().toISOString()
          });
          
        if (roleError) throw roleError;
      }
      
      toast({
        title: "تم إنشاء المستخدم بنجاح",
        description: `تم إضافة ${data.email} ${data.makeAdmin && enableAdminCreation ? 'كمشرف' : 'كمستخدم عادي'}`,
      });
      
      // Reset form
      form.reset();
      
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        title: "فشل إنشاء المستخدم",
        description: error.message || "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">إدارة المستخدمين</h2>
        <p className="text-muted-foreground">
          إنشاء مستخدمين جدد وإدارة أدوارهم
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-500" />
            إعدادات إنشاء المشرفين
          </CardTitle>
          <CardDescription>
            التحكم في إمكانية إنشاء مستخدمين جدد بصلاحيات مشرف
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Wrap this in a Form component to provide the FormContext */}
          <Form {...form}>
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  تفعيل إنشاء المشرفين
                </FormLabel>
                <FormDescription>
                  السماح بإنشاء مستخدمين جدد بصلاحيات مشرف
                </FormDescription>
              </div>
              <Switch
                checked={enableAdminCreation}
                onCheckedChange={handleEnableAdminCreation}
              />
            </div>
          </Form>
          
          {!enableAdminCreation && (
            <Alert className="mt-4 border-amber-500 bg-amber-50 dark:bg-amber-900/20">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertTitle>خاصية إنشاء المشرفين معطلة</AlertTitle>
              <AlertDescription>
                قم بتفعيل الخيار أعلاه لتتمكن من إنشاء مستخدمين جدد بصلاحيات مشرف.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-blue-500" />
            إنشاء مستخدم جديد
          </CardTitle>
          <CardDescription>
            إضافة مستخدم جديد للنظام مع تحديد دوره
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="ادخل البريد الإلكتروني" 
                          className="pl-10" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>كلمة المرور</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="password" 
                          placeholder="أدخل كلمة المرور" 
                          className="pl-10" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="makeAdmin"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center gap-2">
                        <Shield className="h-4 w-4 text-purple-500" />
                        مشرف
                      </FormLabel>
                      <FormDescription>
                        تعيين هذا المستخدم كمشرف مع صلاحيات كاملة
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!enableAdminCreation}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جاري الإنشاء...
                  </>
                ) : (
                  <>
                    <UserCheck className="mr-2 h-4 w-4" />
                    إنشاء المستخدم
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
