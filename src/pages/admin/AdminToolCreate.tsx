
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

// Define the form schema with Zod
const toolFormSchema = z.object({
  company_name: z.string().min(1, 'Name is required'),
  short_description: z.string().min(1, 'Description is required'),
  website: z.string().url('Must be a valid URL').min(1, 'Website URL is required'),
  primary_task: z.string().min(1, 'Primary task is required'),
  pricing: z.string().min(1, 'Pricing information is required'),
  is_featured: z.boolean().default(false),
  is_verified: z.boolean().default(false),
  features: z.string().optional(),
  testimonials: z.string().optional(),
  logo_url: z.string().optional(),
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
      website: '',
      primary_task: '',
      pricing: '',
      is_featured: false,
      is_verified: false,
      features: '',
      testimonials: '',
      logo_url: '',
    },
  });

  // Handle form submission
  const onSubmit = async (values: ToolFormValues) => {
    setIsSaving(true);
    try {
      // Add a click_count field initialized to 0
      const toolData = {
        ...values,
        click_count: 0,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('tools')
        .insert(toolData)
        .select('id')
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'New tool created successfully',
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
    <RequireAuth requireAdmin={true}>
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
                            <Input placeholder="e.g. ChatGPT" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="website"
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
                              <SelectItem value="one-time">One-time Purchase</SelectItem>
                              <SelectItem value="contact">Contact for Pricing</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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
                    name="features"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Features</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="List key features of the tool"
                            {...field}
                            rows={4}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter features separated by new lines
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="testimonials"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Testimonials</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="User testimonials or reviews"
                            {...field}
                            rows={4}
                          />
                        </FormControl>
                        <FormDescription>
                          Optional user testimonials for this tool
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
