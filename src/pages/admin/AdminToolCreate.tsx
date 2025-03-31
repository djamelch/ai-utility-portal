
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { Json } from '@/integrations/supabase/types';

// Define the form schema with Zod
const toolFormSchema = z.object({
  company_name: z.string().min(1, 'اسم الأداة مطلوب'),
  short_description: z.string().min(1, 'الوصف المختصر مطلوب'),
  full_description: z.string().optional(),
  visit_website_url: z.string().url('يجب أن يكون رابط صحيح').min(1, 'رابط الموقع مطلوب'),
  primary_task: z.string().min(1, 'المهمة الرئيسية مطلوبة'),
  pricing: z.string().min(1, 'معلومات التسعير مطلوبة'),
  is_featured: z.boolean().default(false),
  is_verified: z.boolean().default(false),
  pros: z.string().optional(),
  cons: z.string().optional(),
  logo_url: z.string().optional(),
  featured_image_url: z.string().optional(),
  slug: z.string().optional(),
  detail_url: z.string().optional()
});

type ToolFormValues = z.infer<typeof toolFormSchema>;

export default function AdminToolCreate() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form with react-hook-form
  const form = useForm<ToolFormValues>({
    resolver: zodResolver(toolFormSchema),
    defaultValues: {
      company_name: '',
      short_description: '',
      full_description: '',
      visit_website_url: '',
      primary_task: '',
      pricing: '',
      is_featured: false,
      is_verified: false,
      pros: '',
      cons: '',
      logo_url: '',
      featured_image_url: '',
      slug: '',
      detail_url: ''
    },
  });

  // Handle form submission
  const onSubmit = async (values: ToolFormValues) => {
    setIsSaving(true);
    try {
      // Convert form values to match database schema
      const prosArray = values.pros 
        ? values.pros.split('\n').filter(Boolean).map(p => p as Json) 
        : [];
      
      const consArray = values.cons 
        ? values.cons.split('\n').filter(Boolean).map(c => c as Json) 
        : [];
      
      // Prepare applicable_tasks array based on is_featured and is_verified
      const applicable_tasks: Json[] = [];
      if (values.is_featured) applicable_tasks.push('featured' as Json);
      if (values.is_verified) applicable_tasks.push('verified' as Json);
      
      // Generate slug from company name if not provided
      const slug = values.slug || values.company_name.toLowerCase().replace(/\s+/g, '-');
      
      // Add a click_count field initialized to 0
      const toolData = {
        company_name: values.company_name,
        short_description: values.short_description,
        full_description: values.full_description,
        visit_website_url: values.visit_website_url,
        primary_task: values.primary_task,
        pricing: values.pricing,
        applicable_tasks,
        pros: prosArray,
        cons: consArray,
        logo_url: values.logo_url,
        featured_image_url: values.featured_image_url,
        slug,
        detail_url: values.detail_url,
        click_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('tools')
        .insert(toolData)
        .select('id')
        .single();

      if (error) throw error;

      toast({
        title: 'تم بنجاح',
        description: 'تم إنشاء الأداة الجديدة بنجاح',
      });
      navigate('/admin/tools');
    } catch (error: any) {
      console.error('Error creating tool:', error);
      toast({
        title: 'خطأ',
        description: `فشل إنشاء الأداة: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <RequireAuth>
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin/tools')}
                className="mb-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                العودة إلى الأدوات
              </Button>
              <h1 className="text-3xl md:text-4xl font-bold">
                إضافة أداة جديدة
              </h1>
              <p className="mt-2 text-muted-foreground">
                إنشاء أداة ذكاء اصطناعي جديدة في الدليل
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>معلومات الأداة</CardTitle>
              <CardDescription>
                أدخل تفاصيل حول أداة الذكاء الاصطناعي الجديدة
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="company_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>اسم الأداة</FormLabel>
                          <FormControl>
                            <Input placeholder="مثال: ChatGPT" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="visit_website_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رابط الموقع</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="short_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>وصف مختصر</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="وصف موجز للأداة" 
                            {...field} 
                            rows={3} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="full_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>وصف كامل</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="وصف تفصيلي للأداة" 
                            {...field} 
                            rows={5} 
                          />
                        </FormControl>
                        <FormDescription>
                          اشرح بالتفصيل ميزات وفوائد الأداة
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="primary_task"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>المهمة الرئيسية</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر فئة" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="text">إنشاء النصوص</SelectItem>
                              <SelectItem value="image">إنشاء الصور</SelectItem>
                              <SelectItem value="audio">معالجة الصوت</SelectItem>
                              <SelectItem value="video">إنشاء الفيديو</SelectItem>
                              <SelectItem value="code">مساعدة البرمجة</SelectItem>
                              <SelectItem value="research">أداة بحث</SelectItem>
                              <SelectItem value="productivity">الإنتاجية</SelectItem>
                              <SelectItem value="other">أخرى</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pricing"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>التسعير</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر نموذج التسعير" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="free">مجاني</SelectItem>
                              <SelectItem value="freemium">مجاني مع ميزات مدفوعة</SelectItem>
                              <SelectItem value="subscription">اشتراك</SelectItem>
                              <SelectItem value="one-time">دفعة واحدة</SelectItem>
                              <SelectItem value="contact">اتصل للحصول على الأسعار</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="logo_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رابط الشعار</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/logo.png" {...field} />
                          </FormControl>
                          <FormDescription>
                            رابط مباشر لصورة شعار الأداة
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="featured_image_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رابط الصورة المميزة</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/featured.png" {...field} />
                          </FormControl>
                          <FormDescription>
                            رابط مباشر للصورة المميزة للأداة
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الرابط المختصر (Slug)</FormLabel>
                          <FormControl>
                            <Input placeholder="chatgpt" {...field} />
                          </FormControl>
                          <FormDescription>
                            سيتم استخدامه في عنوان URL (اتركه فارغاً لإنشائه تلقائياً)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="detail_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رابط صفحة التفاصيل</FormLabel>
                          <FormControl>
                            <Input placeholder="/tool/chatgpt" {...field} />
                          </FormControl>
                          <FormDescription>
                            رابط لصفحة تفاصيل الأداة (اختياري)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="pros"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>المميزات</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="اكتب المميزات الرئيسية للأداة"
                            {...field}
                            rows={4}
                          />
                        </FormControl>
                        <FormDescription>
                          أدخل المميزات مفصولة بسطر جديد
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cons"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>العيوب</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="اكتب العيوب أو القيود الرئيسية للأداة"
                            {...field}
                            rows={4}
                          />
                        </FormControl>
                        <FormDescription>
                          أدخل العيوب مفصولة بسطر جديد
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="is_featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">أداة مميزة</FormLabel>
                            <FormDescription>
                              عرض هذه الأداة في أقسام المميز
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="is_verified"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">أداة موثقة</FormLabel>
                            <FormDescription>
                              تمييز هذه الأداة كموثقة من قبل المشرفين
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/admin/tools')}
                  >
                    إلغاء
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        جاري الإنشاء...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        إنشاء الأداة
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </main>
    </RequireAuth>
  );
}
