import { useState, useEffect } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ExternalLink, Star, StarHalf, Edit, Trash2 } from "lucide-react";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { Button } from "@/components/ui/button";
import { ToolDetailHeader } from "@/components/tools/ToolDetailHeader";
import { ToolDetailSection } from "@/components/tools/ToolDetailSection";
import { ToolDetailReviews } from "@/components/tools/ToolDetailReviews";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Skeleton } from "@/components/ui/skeleton";

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
})

export default function ToolDetail() {
  const [isLoading, setIsLoading] = useState(true);
  const [tool, setTool] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [initialRating, setInitialRating] = useState(0);
  const [initialComment, setInitialComment] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const editReviewId = location.state?.editReviewId;

  const [reviews, setReviews] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    // Simulate loading time or use for actual data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (slug) {
      fetchToolDetails(slug);
    }
  }, [slug]);

  useEffect(() => {
    if (user && tool) {
      checkIfFavorite(tool.id);
    }
  }, [user, tool]);

  useEffect(() => {
    if (tool) {
      fetchReviews(tool.id);
    }
  }, [tool]);

  const fetchToolDetails = async (slug: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;

      setTool(data);
    } catch (error) {
      console.error('Error fetching tool details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load tool details',
        variant: 'destructive'
      });
      navigate('/tools');
    } finally {
      setIsLoading(false);
    }
  };

  const checkIfFavorite = async (toolId: number) => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user?.id)
        .eq('tool_id', toolId)
        .single();

      if (error) throw error;

      setIsFavorite(!!data);
    } catch (error) {
      console.error('Error checking if favorite:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      if (isFavorite) {
        // Remove from favorites
        const { data, error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('tool_id', tool.id);

        if (error) throw error;

        setIsFavorite(false);
        toast({
          title: 'Success',
          description: 'Removed from favorites',
        });
      } else {
        // Add to favorites
        const { data, error } = await supabase
          .from('favorites')
          .insert([{ user_id: user.id, tool_id: tool.id }]);

        if (error) throw error;

        setIsFavorite(true);
        toast({
          title: 'Success',
          description: 'Added to favorites',
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: 'Error',
        description: 'Failed to update favorites',
        variant: 'destructive'
      });
    }
  };

  const fetchReviews = async (toolId: number) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('tool_id', toolId);

      if (error) throw error;

      setReviews(data);

      // Calculate average rating and review count
      if (data && data.length > 0) {
        const totalRating = data.reduce((sum, review) => sum + review.rating, 0);
        const avgRating = totalRating / data.length;
        setAverageRating(avgRating);
        setReviewCount(data.length);
      } else {
        setAverageRating(0);
        setReviewCount(0);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: 'Error',
        description: 'Failed to load reviews',
        variant: 'destructive'
      });
    }
  };

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: initialRating,
      comment: initialComment,
    },
    mode: "onChange"
  })

  useEffect(() => {
    if (editReviewId) {
      // Find the review with the matching ID
      const reviewToEdit = reviews.find(review => review.id === editReviewId);
      
      if (reviewToEdit) {
        // Set the initial values for the form
        form.setValue("rating", reviewToEdit.rating);
        form.setValue("comment", reviewToEdit.comment || "");
        setInitialRating(reviewToEdit.rating);
        setInitialComment(reviewToEdit.comment || "");
        setIsReviewing(true);
      }
    }
  }, [editReviewId, reviews, form]);

  const onSubmit = async (values: z.infer<typeof reviewSchema>) => {
    try {
      if (!user) {
        navigate('/auth');
        return;
      }

      if (editReviewId) {
        // Update existing review
        const { data, error } = await supabase
          .from('reviews')
          .update({ ...values, user_id: user.id })
          .eq('id', editReviewId);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Review updated successfully',
        });
      } else {
        // Create new review
        const { data, error } = await supabase
          .from('reviews')
          .insert([{ ...values, tool_id: tool.id, user_id: user.id }]);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Review submitted successfully',
        });
      }

      // Refetch reviews
      fetchReviews(tool.id);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit review',
        variant: 'destructive'
      });
    } finally {
      setIsReviewing(false);
      form.reset();
    }
  }

  const handleDeleteReview = async () => {
    try {
      setIsDeleting(true);

      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', editReviewId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Review deleted successfully',
      });

      // Refetch reviews
      fetchReviews(tool.id);
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete review',
        variant: 'destructive'
      });
    } finally {
      setIsDeleting(false);
      setIsReviewing(false);
      form.reset();
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        // Full star
        stars.push(<Star key={i} className="h-5 w-5 text-yellow-500" />);
      } else if (i - 0.5 === rating) {
        // Half star
        stars.push(<StarHalf key={i} className="h-5 w-5 text-yellow-500" />);
      } else {
        // Empty star
        stars.push(<Star key={i} className="h-5 w-5 text-gray-300" />);
      }
    }
    return stars;
  };

  if (isLoading) {
    return (
      <PageWrapper isLoading={true}>
        <div className="container max-w-screen-lg mx-auto px-4">
          <MotionWrapper animation="fadeIn">
            <div className="mb-8">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-4 w-48 mt-2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-40 w-full mt-4" />
                <Skeleton className="h-8 w-32 mt-4" />
                <Skeleton className="h-24 w-full mt-2" />
                <Skeleton className="h-8 w-32 mt-4" />
                <Skeleton className="h-24 w-full mt-2" />
              </div>
              <div>
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full mt-4" />
              </div>
            </div>
            <Skeleton className="h-12 w-full mt-8" />
            <div className="mt-4 space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </MotionWrapper>
        </div>
      </PageWrapper>
    );
  }

  if (!tool) {
    return (
      <PageWrapper>
        <div className="container max-w-screen-lg mx-auto px-4">
          <MotionWrapper animation="fadeIn">
            <div className="text-center py-24">
              <h2 className="text-2xl font-bold">Tool Not Found</h2>
              <p className="mt-2 text-muted-foreground">
                Sorry, we couldn't find the tool you were looking for.
              </p>
              <Button onClick={() => navigate('/tools')}>
                Back to Tools
              </Button>
            </div>
          </MotionWrapper>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="container max-w-screen-lg mx-auto px-4">
        <MotionWrapper animation="fadeIn">
          <div className="mb-8">
            <Link to="/tools" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Tools
            </Link>
          </div>

          <ToolDetailHeader
            logo={tool.logo_url}
            name={tool.company_name}
            description={tool.short_description}
            url={tool.visit_website_url}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
            averageRating={averageRating}
            reviewCount={reviewCount}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <ToolDetailSection title="Overview" content={tool.long_description} />
              <ToolDetailSection title="Pricing" content={tool.pricing} />
            </div>

            <div>
              <div className="rounded-xl bg-secondary/50 dark:bg-secondary/30 border border-border/40 p-6">
                <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-3">
                  <li>
                    <a href={tool.visit_website_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:underline">
                      <ExternalLink className="h-4 w-4" />
                      Visit Website
                    </a>
                  </li>
                  <li>
                    <a href={tool.detail_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:underline">
                      <ExternalLink className="h-4 w-4" />
                      More Details
                    </a>
                  </li>
                </ul>
              </div>

              <div className="rounded-xl bg-secondary/50 dark:bg-secondary/30 border border-border/40 p-6 mt-6">
                <h3 className="text-xl font-semibold mb-4">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge>{tool.primary_task}</Badge>
                  {/* Add more categories as needed */}
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Reviews</h2>
            {user ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button onClick={() => setIsReviewing(true)}>
                    {editReviewId ? 'Edit Review' : 'Add Review'}
                  </Button>
                </SheetTrigger>
                <SheetContent className="sm:max-w-lg">
                  <SheetHeader>
                    <SheetTitle>{editReviewId ? 'Edit Review' : 'Add Review'}</SheetTitle>
                    <SheetDescription>
                      Share your experience with this tool to help others make informed decisions.
                    </SheetDescription>
                  </SheetHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      <FormField
                        control={form.control}
                        name="rating"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rating</FormLabel>
                            <FormControl>
                              <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((index) => (
                                  <Button
                                    key={index}
                                    variant="outline"
                                    className={form.watch("rating") === index ? "bg-primary text-primary-foreground hover:bg-primary/80" : ""}
                                    onClick={() => field.onChange(index)}
                                  >
                                    {index} <Star className="ml-2 h-4 w-4" />
                                  </Button>
                                ))}
                              </div>
                            </FormControl>
                            <FormDescription>
                              How would you rate your experience with this tool?
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="comment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Comment</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Share your thoughts about this tool"
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Feel free to share more details about your experience.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end gap-2">
                        {editReviewId && (
                          <Button 
                            variant="destructive"
                            onClick={handleDeleteReview}
                            disabled={isDeleting}
                          >
                            {isDeleting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Review
                              </>
                            )}
                          </Button>
                        )}
                        <Button type="submit" disabled={!form.isValid}>
                          {editReviewId ? 'Update Review' : 'Submit Review'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </SheetContent>
              </Sheet>
            ) : (
              <Button onClick={() => navigate('/auth')}>
                Login to Add Review
              </Button>
            )}
          </div>

          <ToolDetailReviews reviews={reviews} renderStars={renderStars} />
        </MotionWrapper>
      </div>
    </PageWrapper>
  );
}
