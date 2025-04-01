
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageLoadingWrapper } from '@/components/ui/PageLoadingWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const blogPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long"),
  slug: z.string()
    .min(5, "Slug must be at least 5 characters long")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters long").max(300, "Excerpt must be at most 300 characters"),
  content: z.string().min(50, "Content must be at least 50 characters long"),
  cover_image_url: z.string().url("Cover image URL must be a valid URL").optional().or(z.literal('')),
  category: z.string().min(1, "Category is required"),
  read_time: z.string().min(1, "Read time is required"),
  featured: z.boolean().default(false),
});

type BlogFormValues = z.infer<typeof blogPostSchema>;

const categories = [
  "AI Tools",
  "Technology",
  "Productivity",
  "Tutorials",
  "News",
  "Business",
  "Marketing",
  "Design",
  "Development",
  "Other"
];

const readTimes = [
  "2 min",
  "3 min",
  "5 min",
  "8 min",
  "10 min",
  "15 min",
  "20 min",
  "30 min"
];

export default function AdminBlogCreate() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      cover_image_url: '',
      category: 'AI Tools',
      read_time: '5 min',
      featured: false,
    },
  });

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Update slug when title changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'title') {
        const slug = generateSlug(value.title || '');
        form.setValue('slug', slug, { shouldValidate: true });
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (data: BlogFormValues) => {
    if (!user) {
      toast({
        title: "Authentication error",
        description: "You must be logged in to create blog posts",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Check if slug is already taken
      const { data: existingPost, error: checkError } = await supabase
        .from('blog_posts')
        .select('slug')
        .eq('slug', data.slug)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingPost) {
        form.setError('slug', { 
          message: 'This slug is already in use. Please choose another one.' 
        });
        setIsSaving(false);
        return;
      }

      // Insert new blog post
      const { data: newPost, error } = await supabase
        .from('blog_posts')
        .insert({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          content: data.content,
          cover_image_url: data.cover_image_url || null,
          category: data.category,
          read_time: data.read_time,
          featured: data.featured,
          author_id: user.id,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Blog post created",
        description: "Your blog post has been created successfully",
      });

      navigate('/admin/blogs');
    } catch (error) {
      console.error('Error creating blog post:', error);
      toast({
        title: "Error creating blog post",
        description: "An error occurred while creating the blog post",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <RequireAuth>
      <PageLoadingWrapper isLoading={isLoading} loadingText="Loading...">
        <Navbar />
        <main className="flex-1 pt-24 pb-16">
          <div className="container max-w-screen-xl mx-auto px-4">
            <div className="mb-6">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/admin/blogs')} 
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Blog Posts
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Blog Post</CardTitle>
                    <CardDescription>
                      Fill in the details below to create a new blog post
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                  <Input placeholder="Blog Post Title" {...field} />
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
                                  <Input placeholder="blog-post-slug" {...field} />
                                </FormControl>
                                <FormDescription>
                                  URL-friendly version of the title
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="excerpt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Excerpt</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Brief summary of your blog post"
                                  {...field} 
                                  rows={3}
                                />
                              </FormControl>
                              <FormDescription>
                                A short description shown in previews (max 300 characters)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Content</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Write your blog post content here..."
                                  {...field} 
                                  rows={12}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category</FormLabel>
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
                                    {categories.map((category) => (
                                      <SelectItem key={category} value={category}>
                                        {category}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="read_time"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Read Time</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select read time" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {readTimes.map((time) => (
                                      <SelectItem key={time} value={time}>
                                        {time}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="cover_image_url"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cover Image URL</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="https://example.com/image.jpg" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                URL to an image for your blog post (optional)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="featured"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Featured Post</FormLabel>
                                <FormDescription>
                                  This post will be highlighted on the blog homepage
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />

                        <Button 
                          type="submit" 
                          className="w-full gap-2"
                          disabled={isSaving}
                        >
                          {isSaving ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4" />
                              Create Blog Post
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Blog Post Guide</CardTitle>
                    <CardDescription>
                      Tips for creating effective blog posts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Title</h3>
                      <p className="text-sm text-muted-foreground">
                        Keep titles concise, descriptive, and engaging to attract readers.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Excerpt</h3>
                      <p className="text-sm text-muted-foreground">
                        Write a compelling summary that entices readers to continue reading.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Content</h3>
                      <p className="text-sm text-muted-foreground">
                        Organize your content with headings, paragraphs, and bullet points for readability.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Images</h3>
                      <p className="text-sm text-muted-foreground">
                        Use high-quality images relevant to your content. Ensure you have rights to use them.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </PageLoadingWrapper>
    </RequireAuth>
  );
}
