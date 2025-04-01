
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { ArrowLeft, Save, Loader2, FileText, ExternalLink } from 'lucide-react';
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

export default function AdminBlogEdit() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [postNotFound, setPostNotFound] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [originalSlug, setOriginalSlug] = useState('');

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

  // Fetch blog post data
  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          setPostNotFound(true);
          return;
        }

        form.reset({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          content: data.content,
          cover_image_url: data.cover_image_url || '',
          category: data.category,
          read_time: data.read_time,
          featured: data.featured || false,
        });
        
        setOriginalSlug(data.slug);
      } catch (error) {
        console.error('Error fetching blog post:', error);
        toast({
          title: "Error fetching blog post",
          description: "Failed to load blog post data",
          variant: "destructive",
        });
        setPostNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPost();
  }, [id, form, toast]);

  const onSubmit = async (data: BlogFormValues) => {
    if (!user || !id) {
      toast({
        title: "Authentication error",
        description: "You must be logged in to update blog posts",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Check if slug is already taken (only if slug has changed)
      if (data.slug !== originalSlug) {
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
      }

      // Update blog post
      const { error } = await supabase
        .from('blog_posts')
        .update({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          content: data.content,
          cover_image_url: data.cover_image_url || null,
          category: data.category,
          read_time: data.read_time,
          featured: data.featured,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast({
        title: "Blog post updated",
        description: "Your blog post has been updated successfully",
      });

      navigate('/admin/blogs');
    } catch (error) {
      console.error('Error updating blog post:', error);
      toast({
        title: "Error updating blog post",
        description: "An error occurred while updating the blog post",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (postNotFound) {
    return (
      <RequireAuth>
        <PageLoadingWrapper isLoading={authLoading} loadingText="Loading...">
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
              
              <Card className="text-center p-8">
                <CardContent className="pt-6">
                  <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Blog Post Not Found</h2>
                  <p className="text-muted-foreground mb-4">
                    The blog post you're looking for doesn't exist or has been deleted.
                  </p>
                  <Button onClick={() => navigate('/admin/blogs')}>
                    Return to Blog Posts
                  </Button>
                </CardContent>
              </Card>
            </div>
          </main>
          <Footer />
        </PageLoadingWrapper>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <PageLoadingWrapper 
        isLoading={authLoading || isLoading} 
        loadingText="Loading blog post..."
      >
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
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Edit Blog Post</CardTitle>
                        <CardDescription>
                          Update the details of your blog post
                        </CardDescription>
                      </div>
                      {originalSlug && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(`/blog/${originalSlug}`, '_blank')}
                          className="gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View on site
                        </Button>
                      )}
                    </div>
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
                              Update Blog Post
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
