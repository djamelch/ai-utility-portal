
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
  company_name: z.string().min(1, 'Tool name is required'),
  short_description: z.string().min(1, 'Short description is required'),
  full_description: z.string().optional(),
  visit_website_url: z.string().url('Must be a valid URL').min(1, 'Website URL is required'),
  primary_task: z.string().min(1, 'Primary task is required'),
  pricing: z.string().min(1, 'Pricing information is required'),
  is_featured: z.boolean().default(false),
  is_verified: z.boolean().default(false),
  pros: z.string().optional(),
  cons: z.string().optional(),
  faqs: z.string().optional(),
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
      faqs: '',
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
      console.log('Submitting form values:', values);
      
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
      
      // Process FAQs
      let faqs: Json | null = null;
      if (values.faqs) {
        try {
          // Try to parse as JSON first
          faqs = JSON.parse(values.faqs) as Json;
        } catch (e) {
          // If not valid JSON, store as string
          faqs = values.faqs as Json;
        }
      }
      
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
        faqs,
        logo_url: values.logo_url,
        featured_image_url: values.featured_image_url,
        slug,
        detail_url: values.detail_url,
        click_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Sending to database:', toolData);

      const { data, error } = await supabase
        .from('tools')
        .insert(toolData)
        .select('id')
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'The new tool has been created successfully',
      });
      navigate('/admin/tools');
    } catch (error: any) {
      console.error('Error creating tool:', error);
      toast({
        title: 'Error',
        description: `Failed to create tool: ${error.message}`,
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
                Back to Tools
              </Button>
              <h1 className="text-3xl md:text-4xl font-bold">
                Add New Tool
              </h1>
              <p className="mt-2 text-muted-foreground">
                Create a new AI tool in the directory
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tool Information</CardTitle>
              <CardDescription>
                Enter details about the new AI tool
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
                            <Input placeholder="Example: ChatGPT" {...field} />
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
                          <FormLabel>Website URL</FormLabel>
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
                        <FormLabel>Short Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief description of the tool" 
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
                        <FormLabel>Full Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Detailed description of the tool" 
                            {...field} 
                            rows={5} 
                          />
                        </FormControl>
                        <FormDescription>
                          Explain in detail the features and benefits of the tool
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
                          <FormLabel>Primary Task</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="text">Text Generation</SelectItem>
                              <SelectItem value="image">Image Generation</SelectItem>
                              <SelectItem value="audio">Audio Processing</SelectItem>
                              <SelectItem value="video">Video Creation</SelectItem>
                              <SelectItem value="code">Coding Assistant</SelectItem>
                              <SelectItem value="research">Research Tool</SelectItem>
                              <SelectItem value="productivity">Productivity</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
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
                          <FormLabel>Pricing</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
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
                              <SelectItem value="one-time">One-time Payment</SelectItem>
                              <SelectItem value="contact">Contact for Pricing</SelectItem>
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
                            <Input placeholder="https://example.com/featured.png" {...field} />
                          </FormControl>
                          <FormDescription>
                            Direct link to a featured image for the tool
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
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                            <Input placeholder="chatgpt" {...field} />
                          </FormControl>
                          <FormDescription>
                            Used in the URL (leave empty to generate automatically)
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
                            <Input placeholder="/tool/chatgpt" {...field} />
                          </FormControl>
                          <FormDescription>
                            URL for the tool detail page (optional)
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
                        <FormLabel>Pros</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter the main pros of the tool"
                            {...field}
                            rows={4}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter pros separated by new lines
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
                        <FormLabel>Cons</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter the main cons or limitations of the tool"
                            {...field}
                            rows={4}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter cons separated by new lines
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
                        <FormLabel>FAQs / Testimonials</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="FAQs or user testimonials"
                            {...field}
                            rows={4}
                          />
                        </FormControl>
                        <FormDescription>
                          Can be entered in JSON format
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
                              Display this tool in featured sections
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
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/admin/tools')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Create Tool
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
