
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { PageLoadingWrapper } from '@/components/ui/PageLoadingWrapper';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { Json } from '@/integrations/supabase/types';

const toolFormSchema = z.object({
  company_name: z.string().min(1, 'Name is required'),
  short_description: z.string().min(1, 'Short description is required'),
  full_description: z.string().optional(),
  visit_website_url: z.string().url('Must be a valid URL').min(1, 'Website URL is required'),
  detail_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  primary_task: z.string().min(1, 'Primary task is required'),
  pricing: z.string().min(1, 'Pricing information is required'),
  slug: z.string().optional(),
  logo_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  featured_image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  is_featured: z.boolean().default(false),
  is_verified: z.boolean().default(false),
  applicable_tasks: z.array(z.string()).optional(),
  pros: z.string().optional(),
  cons: z.string().optional(),
  faqs: z.string().optional(),
});

type ToolFormValues = z.infer<typeof toolFormSchema>;

interface ToolDatabaseFields {
  id?: number;
  click_count?: number;
  applicable_tasks?: Json[];
  pros?: Json[];
  cons?: Json[];
  faqs?: Json | null;
  created_at?: string;
  updated_at?: string;
}

export default function AdminToolEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [additionalFields, setAdditionalFields] = useState<ToolDatabaseFields>({
    applicable_tasks: [],
    pros: [],
    cons: [],
    faqs: null
  });

  const form = useForm<ToolFormValues>({
    resolver: zodResolver(toolFormSchema),
    defaultValues: {
      company_name: '',
      short_description: '',
      full_description: '',
      visit_website_url: '',
      detail_url: '',
      primary_task: '',
      pricing: '',
      slug: '',
      is_featured: false,
      is_verified: false,
      logo_url: '',
      featured_image_url: '',
      pros: '',
      cons: '',
      applicable_tasks: [],
      faqs: '',
    },
  });

  useEffect(() => {
    const fetchTool = async () => {
      try {
        setIsLoading(true);
        const toolId = parseInt(id || '0', 10);
        
        if (isNaN(toolId)) {
          throw new Error('Invalid tool ID');
        }
        
        const { data, error } = await supabase
          .from('tools')
          .select('*')
          .eq('id', toolId)
          .single();

        if (error) throw error;

        if (data) {
          console.log("Fetched tool data:", data);
          
          const newAdditionalFields = {
            id: data.id,
            click_count: data.click_count || 0,
            created_at: data.created_at,
            updated_at: data.updated_at,
            pros: data.pros || [],
            cons: data.cons || [],
            applicable_tasks: data.applicable_tasks || [],
            faqs: data.faqs || null,
          };
          
          setAdditionalFields(newAdditionalFields);

          const is_featured = Array.isArray(data.applicable_tasks) && 
                             data.applicable_tasks.includes('featured');
          
          const is_verified = Array.isArray(data.applicable_tasks) && 
                             data.applicable_tasks.includes('verified');

          const prosText = Array.isArray(data.pros) ? data.pros.join('\n') : '';
          const consText = Array.isArray(data.cons) ? data.cons.join('\n') : '';
          
          // Changed from const to let to fix the reassignment error
          let faqsText = '';
          if (data.faqs) {
            try {
              if (typeof data.faqs === 'string') {
                faqsText = data.faqs;
              } else {
                faqsText = JSON.stringify(data.faqs, null, 2);
              }
            } catch (e) {
              console.error('Error formatting FAQs:', e);
            }
          }

          form.reset({
            company_name: data.company_name || '',
            short_description: data.short_description || '',
            full_description: data.full_description || '',
            visit_website_url: data.visit_website_url || '',
            detail_url: data.detail_url || '',
            primary_task: data.primary_task || '',
            pricing: data.pricing || '',
            slug: data.slug || '',
            logo_url: data.logo_url || '',
            featured_image_url: data.featured_image_url || '',
            is_featured: is_featured,
            is_verified: is_verified,
            pros: prosText,
            cons: consText,
            applicable_tasks: data.applicable_tasks as string[] || [],
            faqs: faqsText,
          });
        }
      } catch (error: any) {
        console.error('Error fetching tool:', error);
        toast({
          title: 'Error',
          description: `Failed to load tool data: ${error.message}`,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTool();
  }, [id, form, toast]);

  const onSubmit = async (values: ToolFormValues) => {
    setIsSaving(true);
    try {
      const toolId = parseInt(id || '0', 10);
      
      if (isNaN(toolId)) {
        throw new Error('Invalid tool ID');
      }

      const applicable_tasks: Json[] = [];
      
      if (values.is_featured) applicable_tasks.push('featured' as Json);
      if (values.is_verified) applicable_tasks.push('verified' as Json);
      
      if (additionalFields.applicable_tasks) {
        additionalFields.applicable_tasks.forEach(task => {
          if (task !== 'featured' && task !== 'verified' && !applicable_tasks.includes(task)) {
            applicable_tasks.push(task);
          }
        });
      }
      
      const pros: Json[] = values.pros ? values.pros.split('\n').filter(Boolean).map(f => f as Json) : [];
      
      const cons: Json[] = values.cons ? values.cons.split('\n').filter(Boolean).map(f => f as Json) : [];
      
      let faqs: Json | null = null;
      try {
        if (values.faqs) {
          faqs = JSON.parse(values.faqs) as Json;
        }
      } catch (e) {
        console.warn('Could not parse FAQs as JSON', e);
        toast({
          title: 'Warning',
          description: 'FAQs could not be parsed as valid JSON. Please check the format.',
          variant: 'destructive',
        });
        setIsSaving(false);
        return;
      }

      const { error } = await supabase
        .from('tools')
        .update({
          company_name: values.company_name,
          short_description: values.short_description,
          full_description: values.full_description || null,
          visit_website_url: values.visit_website_url,
          detail_url: values.detail_url || null,
          primary_task: values.primary_task,
          pricing: values.pricing,
          slug: values.slug || null,
          applicable_tasks,
          pros,
          cons,
          faqs,
          logo_url: values.logo_url || null,
          featured_image_url: values.featured_image_url || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', toolId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Tool updated successfully',
      });
      navigate('/admin/tools');
    } catch (error: any) {
      console.error('Error updating tool:', error);
      toast({
        title: 'Error',
        description: `Failed to update tool: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <RequireAuth requireAdmin={true}>
      <PageLoadingWrapper isLoading={isLoading} loadingText="Loading tool data...">
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
                  Back to Tools
                </Button>
                <h1 className="text-3xl md:text-4xl font-bold">
                  Edit Tool
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Update information for this AI tool
                </p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Tool Information</CardTitle>
                <CardDescription>
                  Modify the details of this AI tool
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
                            <FormLabel>Tool Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. ChatGPT" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. chatgpt" {...field} />
                            </FormControl>
                            <FormDescription>
                              URL-friendly version of the name for detail pages
                            </FormDescription>
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
                          <FormLabel>Short Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Brief description of the tool" 
                              {...field} 
                              rows={3} 
                            />
                          </FormControl>
                          <FormDescription>
                            Short summary displayed in tool cards
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="full_description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Detailed description of the tool" 
                              {...field} 
                              rows={5} 
                            />
                          </FormControl>
                          <FormDescription>
                            Comprehensive description for the tool detail page
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="visit_website_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com" {...field} />
                            </FormControl>
                            <FormDescription>
                              Main website link for the tool
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
                            <FormLabel>Detail URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/details" {...field} />
                            </FormControl>
                            <FormDescription>
                              Optional URL for additional details
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="primary_task"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Task</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="text">Text Generation</SelectItem>
                                <SelectItem value="image">Image Generation</SelectItem>
                                <SelectItem value="audio">Audio Processing</SelectItem>
                                <SelectItem value="video">Video Creation</SelectItem>
                                <SelectItem value="code">Code Assistance</SelectItem>
                                <SelectItem value="research">Research Tool</SelectItem>
                                <SelectItem value="productivity">Productivity</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Main category/function of the tool
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="pricing"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pricing</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select pricing model" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="free">Free</SelectItem>
                                <SelectItem value="freemium">Freemium</SelectItem>
                                <SelectItem value="subscription">Subscription</SelectItem>
                                <SelectItem value="one-time">One-time Purchase</SelectItem>
                                <SelectItem value="contact">Contact for Pricing</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Pricing model of the tool
                            </FormDescription>
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
                            <FormLabel>Logo URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/logo.png" {...field} />
                            </FormControl>
                            <FormDescription>
                              Direct link to the tool's logo image
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
                            <FormLabel>Featured Image URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/featured.jpg" {...field} />
                            </FormControl>
                            <FormDescription>
                              Banner image for featured displays
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
                          <FormLabel>Pros / Features</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="List key features or pros of the tool (one per line)"
                              {...field}
                              rows={4}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter each pro/feature on a new line
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
                          <FormLabel>Cons / Limitations</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="List limitations or cons of the tool (one per line)"
                              {...field}
                              rows={4}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter each con/limitation on a new line
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="faqs"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>FAQs (JSON Format)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder='[{"question": "What is this tool?", "answer": "This tool helps with..."}]'
                              {...field}
                              rows={6}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter FAQs in valid JSON format as an array of question/answer objects
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
                              <FormLabel className="text-base">Featured Tool</FormLabel>
                              <FormDescription>
                                Show this tool in featured sections
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
                              <FormLabel className="text-base">Verified Tool</FormLabel>
                              <FormDescription>
                                Mark this tool as verified by administrators
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

                    {additionalFields.id && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 p-4 bg-muted rounded-lg">
                        <div>
                          <h4 className="font-medium text-sm">ID</h4>
                          <p className="text-sm text-muted-foreground">{additionalFields.id}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Click Count</h4>
                          <p className="text-sm text-muted-foreground">{additionalFields.click_count || 0}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Created At</h4>
                          <p className="text-sm text-muted-foreground">
                            {additionalFields.created_at ? new Date(additionalFields.created_at).toLocaleString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/admin/tools')}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSaving || !form.formState.isDirty}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </div>
        </main>
      </PageLoadingWrapper>
    </RequireAuth>
  );
}
