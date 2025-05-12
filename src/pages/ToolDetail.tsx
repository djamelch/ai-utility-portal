
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink, Star, User, Calendar, Tag, Clock, ChevronLeft, Loader2, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { SEOHead } from '@/components/seo/SEOHead';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user_id: string;
  user_email?: string;
}

export default function ToolDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [tool, setTool] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [userReview, setUserReview] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchTool = async () => {
      setLoading(true);
      setNotFound(false);
      
      try {
        if (!slug) {
          console.error('Slug is undefined');
          setNotFound(true);
          setLoading(false);
          return;
        }

        console.log("Fetching tool with slug:", slug);
        
        // Extract potential ID from slug (if format is like "5-out")
        const potentialId = slug.split('-')[0];
        const isNumericId = /^\d+$/.test(potentialId);
        
        console.log("Extracted potential ID:", potentialId, "Is numeric:", isNumericId);
        
        let toolData = null;
        
        // First try with exact slug match
        console.log("Trying to fetch by exact slug:", slug);
        const exactSlugResult = await supabase
          .from('tools')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();
          
        if (exactSlugResult.data && !exactSlugResult.error) {
          console.log("Found tool by exact slug:", exactSlugResult.data);
          toolData = exactSlugResult.data;
        } else if (exactSlugResult.error) {
          console.error("Error fetching by exact slug:", exactSlugResult.error);
        }
        
        // If no tool found by exact slug, try with ID if it looks like a number
        if (!toolData && isNumericId) {
          console.log("Trying to fetch by ID:", potentialId);
          
          const idResult = await supabase
            .from('tools')
            .select('*')
            .eq('id', parseInt(potentialId))
            .maybeSingle();
            
          if (idResult.data && !idResult.error) {
            console.log("Found tool by ID:", idResult.data);
            toolData = idResult.data;
          } else if (idResult.error) {
            console.error("Error fetching by ID:", idResult.error);
          }
        }
        
        // If still no tool found, try with partial slug match
        if (!toolData) {
          console.log("Trying to fetch by partial slug match");
          
          const partialSlugResult = await supabase
            .from('tools')
            .select('*')
            .ilike('slug', `%${slug}%`)
            .limit(1)
            .maybeSingle();
            
          if (partialSlugResult.data && !partialSlugResult.error) {
            console.log("Found tool by partial slug match:", partialSlugResult.data);
            toolData = partialSlugResult.data;
          } else if (partialSlugResult.error) {
            console.error("Error fetching by partial slug match:", partialSlugResult.error);
          }
        }
        
        // If still no tool found, try with company name
        if (!toolData) {
          console.log("No tool found by slug or ID, trying with company name");
          
          const nameResult = await supabase
            .from('tools')
            .select('*')
            .ilike('company_name', `%${slug.replace(/-/g, ' ')}%`)
            .limit(1)
            .maybeSingle();
            
          if (nameResult.data && !nameResult.error) {
            console.log("Found tool by company name:", nameResult.data);
            toolData = nameResult.data;
          } else if (nameResult.error) {
            console.error("Error fetching by company name:", nameResult.error);
          }
        }
        
        if (!toolData) {
          console.error('Tool not found with any method. Slug:', slug);
          setNotFound(true);
          setLoading(false);
          return;
        }
        
        console.log('Tool data fetched successfully:', toolData);
        setTool(toolData);
        
        // Now fetch reviews for this tool
        if (toolData.id) {
          fetchReviews(toolData.id);
        }
      } catch (error) {
        console.error('Error in fetchTool:', error);
        toast({
          title: 'Error fetching tool',
          description: 'Failed to load tool details. Please try again.',
          variant: 'destructive',
        });
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTool();
    
    if (location.state?.editReviewId) {
      setEditingReviewId(location.state.editReviewId);
      setReviewDialogOpen(true);
    }
  }, [slug, toast, location.state]);
  
  const fetchReviews = async (toolId: number) => {
    if (!toolId) {
      console.error("Cannot fetch reviews: Tool ID is undefined");
      return;
    }
    
    setReviewsLoading(true);
    try {
      console.log("Fetching reviews for tool ID:", toolId);
      
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          user_id
        `)
        .eq('tool_id', toolId)
        .order('created_at', { ascending: false });
      
      if (reviewsError) {
        console.error("Error fetching reviews:", reviewsError);
        throw reviewsError;
      }
      
      console.log("Reviews fetched:", reviewsData?.length || 0);
      
      const formattedReviews = reviewsData ? reviewsData.map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        created_at: new Date(review.created_at).toLocaleDateString(),
        user_id: review.user_id,
        user_email: `User-${review.user_id.substring(0, 8)}`
      })) : [];
      
      setReviews(formattedReviews);
      
      if (formattedReviews.length > 0) {
        const total = formattedReviews.reduce((sum, review) => sum + review.rating, 0);
        setAverageRating(Number((total / formattedReviews.length).toFixed(1)));
      } else {
        setAverageRating(null);
      }
      
      if (user) {
        const userReview = formattedReviews.find(review => review.user_id === user.id);
        if (userReview) {
          setUserHasReviewed(true);
          if (location.state?.editReviewId === userReview.id) {
            setUserRating(userReview.rating);
            setUserReview(userReview.comment || '');
            setEditingReviewId(userReview.id);
          }
        } else {
          setUserHasReviewed(false);
        }
      }
    } catch (error) {
      console.error('Error in fetchReviews:', error);
      toast({
        title: 'Error',
        description: 'Failed to load reviews',
        variant: 'destructive'
      });
    } finally {
      setReviewsLoading(false);
    }
  };
  
  const handleVisitWebsite = async () => {
    if (!tool) return;
    
    try {
      await supabase.rpc('increment_tool_click_count', { tool_id: tool.id });
      
      const url = tool.visit_website_url || tool.detail_url || '#';
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };
  
  const handleReviewSubmit = async () => {
    try {
      setSubmitting(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to submit a review",
          variant: "destructive",
        });
        setReviewDialogOpen(false);
        return;
      }
      
      if (editingReviewId) {
        const { error } = await supabase.from('reviews')
          .update({
            rating: userRating,
            comment: userReview,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingReviewId);
        
        if (error) throw error;
        
        toast({
          title: "Review Updated",
          description: "Your review has been updated successfully",
        });
      } else {
        const { error } = await supabase.from('reviews').insert({
          tool_id: tool.id,
          user_id: session.user.id,
          rating: userRating,
          comment: userReview
        });
        
        if (error) throw error;
        
        toast({
          title: "Review Submitted",
          description: "Thank you for your feedback!",
        });
      }
      
      setUserReview('');
      setUserRating(5);
      setReviewDialogOpen(false);
      setEditingReviewId(null);
      
      fetchReviews(tool.id);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit your review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);
      
      if (error) throw error;
      
      toast({
        title: "Deleted",
        description: "Your review has been deleted",
      });
      
      fetchReviews(tool.id);
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      });
    }
  };
  
  const StarRating = () => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none"
            onClick={() => setUserRating(star)}
          >
            <Star
              size={24}
              className={`${
                star <= userRating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };
  
  const RatingStars = ({ rating }: { rating: number }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    );
  };
  
  const renderReviewButton = () => {
    if (!user) {
      return (
        <Button onClick={() => navigate('/auth')}>
          Log in to write a review
        </Button>
      );
    }
    
    if (userHasReviewed) {
      return (
        <Button 
          variant="outline"
          onClick={() => {
            const userReview = reviews.find(r => r.user_id === user.id);
            if (userReview) {
              setEditingReviewId(userReview.id);
              setUserRating(userReview.rating);
              setUserReview(userReview.comment || '');
              setReviewDialogOpen(true);
            }
          }}
        >
          Edit Your Review
        </Button>
      );
    }
    
    return (
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogTrigger asChild>
          <Button>Write a Review</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingReviewId ? 'Edit Your Review' : 'Write a Review'}
            </DialogTitle>
            <DialogDescription>
              Share your experience with {tool?.company_name} to help others.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <StarRating />
            </div>
            <div className="space-y-2">
              <Label htmlFor="review">Your Review</Label>
              <Textarea
                id="review"
                placeholder="What did you like or dislike about this tool?"
                rows={5}
                value={userReview}
                onChange={(e) => setUserReview(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setReviewDialogOpen(false);
                setEditingReviewId(null);
                setUserRating(5);
                setUserReview('');
              }}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleReviewSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {editingReviewId ? 'Updating...' : 'Submitting...'}
                </>
              ) : editingReviewId ? 'Update Review' : 'Submit Review'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  
  const ReviewsList = () => {
    if (reviewsLoading) {
      return (
        <div className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      );
    }
    
    if (reviews.length === 0) {
      return (
        <div className="text-center py-8">
          <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">No Reviews Yet</h3>
          <p className="text-muted-foreground mb-6">
            Be the first to review this tool and help others make better decisions.
          </p>
          {renderReviewButton()}
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">
            {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
          </h3>
          {!userHasReviewed && renderReviewButton()}
        </div>
        
        <div className="divide-y">
          {reviews.map(review => (
            <div key={review.id} className="py-4">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <RatingStars rating={review.rating} />
                  <span className="text-sm font-medium">{review.user_email}</span>
                  <span className="text-xs text-muted-foreground">
                    {review.created_at}
                  </span>
                </div>
                
                {user && user.id === review.user_id && (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingReviewId(review.id);
                        setUserRating(review.rating);
                        setUserReview(review.comment || '');
                        setReviewDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteReview(review.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                )}
              </div>
              
              {review.comment && (
                <p className="mt-2 text-muted-foreground">
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const generateSchemaData = () => {
    if (!tool) return null;
    
    return {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": tool.company_name,
      "description": tool.short_description || tool.full_description,
      "image": tool.logo_url || tool.featured_image_url,
      "url": `https://your-domain.com/tool/${tool.slug || tool.id}`,
      "applicationCategory": tool.primary_task || "Application",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/OnlineOnly",
        "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
      },
      "aggregateRating": averageRating ? {
        "@type": "AggregateRating",
        "ratingValue": averageRating.toString(),
        "ratingCount": reviews.length.toString(),
        "bestRating": "5",
        "worstRating": "1"
      } : undefined
    };
  };
  
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }
  
  if (notFound) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 py-24">
          <div className="container-wide">
            <MotionWrapper animation="fadeIn">
              <div className="text-center py-12">
                <h1 className="text-4xl font-bold mb-4">Tool Not Found</h1>
                <p className="text-muted-foreground mb-8">
                  The tool you are looking for does not exist or has been removed.
                </p>
                <Button onClick={() => navigate('/tools')}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Return to Tools
                </Button>
              </div>
            </MotionWrapper>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!tool) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="text-muted-foreground mb-6">Failed to load tool details.</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      <SEOHead
        title={tool ? `${tool.company_name} - Tool Details` : 'Tool Not Found'}
        description={tool ? (tool.short_description || `Learn about ${tool.company_name}, its features, pricing, and user reviews.`) : 'The tool does not exist or has been removed.'}
        keywords={tool ? `${tool.company_name}, AI tool, ${tool.primary_task || ''}, ${tool.pricing || ''}, AI software` : 'AI tool, not found'}
        ogImage={tool?.featured_image_url || tool?.logo_url}
        ogType="product"
        canonicalUrl={`/tool/${slug}`}
        schemaData={generateSchemaData()}
      />
      
      <Navbar />
      
      <main className="flex-1 py-24">
        <div className="container-wide">
          <MotionWrapper animation="fadeIn">
            <Button 
              variant="ghost" 
              className="mb-6"
              onClick={() => navigate('/tools')}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Tools
            </Button>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-lg border bg-background flex-shrink-0">
                    <img 
                      src={tool.logo_url || "https://via.placeholder.com/120?text=AI+Tool"} 
                      alt={`${tool.company_name} logo`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/120?text=AI+Tool";
                      }}
                    />
                  </div>
                  
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">{tool.company_name}</h1>
                    <p className="text-muted-foreground">{tool.short_description}</p>
                  </div>
                </div>
                
                {tool.featured_image_url && (
                  <div className="rounded-xl overflow-hidden aspect-video bg-secondary/30">
                    <img 
                      src={tool.featured_image_url} 
                      alt={`${tool.company_name} featured image`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="mt-6">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-3">About the Tool</h2>
                        <p className="text-muted-foreground whitespace-pre-line">
                          {tool.full_description || tool.short_description || "No description available."}
                        </p>
                      </div>
                      
                      {(tool.pros && tool.pros.length > 0) || (tool.cons && tool.cons.length > 0) ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {tool.pros && tool.pros.length > 0 && (
                            <div className="space-y-2">
                              <h3 className="font-medium">Pros</h3>
                              <ul className="space-y-1">
                                {tool.pros.map((pro: string, i: number) => (
                                  <li key={i} className="flex items-start">
                                    <span className="text-green-500 mr-2">✓</span>
                                    <span>{pro}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {tool.cons && tool.cons.length > 0 && (
                            <div className="space-y-2">
                              <h3 className="font-medium">Cons</h3>
                              <ul className="space-y-1">
                                {tool.cons.map((con: string, i: number) => (
                                  <li key={i} className="flex items-start">
                                    <span className="text-red-500 mr-2">✗</span>
                                    <span>{con}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ) : null}
                      
                      {tool.faqs && Object.keys(tool.faqs || {}).length > 0 && (
                        <div>
                          <h2 className="text-xl font-semibold mb-3">FAQs</h2>
                          <div className="space-y-4">
                            {Array.isArray(tool.faqs) ? 
                              tool.faqs.map((faq: any, i: number) => (
                                <div key={i} className="border rounded-lg p-4">
                                  <h3 className="font-medium mb-2">{faq.question}</h3>
                                  <p className="text-muted-foreground">{faq.answer}</p>
                                </div>
                              )) : 
                              Object.entries(tool.faqs || {}).map(([key, value]: [string, any], i: number) => (
                                <div key={i} className="border rounded-lg p-4">
                                  <h3 className="font-medium mb-2">{key}</h3>
                                  <p className="text-muted-foreground">{value}</p>
                                </div>
                              ))
                            }
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="details" className="mt-6">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-3">Technical Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                          {tool.primary_task && (
                            <div className="flex items-center gap-2">
                              <Tag className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">Primary Task</p>
                                <p className="text-sm text-muted-foreground">{tool.primary_task}</p>
                              </div>
                            </div>
                          )}
                          
                          {tool.pricing && (
                            <div className="flex items-center gap-2">
                              <Tag className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">Pricing Model</p>
                                <p className="text-sm text-muted-foreground">{tool.pricing}</p>
                              </div>
                            </div>
                          )}
                          
                          {tool.created_at && (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">Added On</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(tool.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          )}
                          
                          {tool.updated_at && tool.updated_at !== tool.created_at && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">Last Update</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(tool.updated_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {tool.applicable_tasks && tool.applicable_tasks.length > 0 && (
                        <div>
                          <h3 className="font-medium mb-2">Applicable Tasks</h3>
                          <div className="flex flex-wrap gap-2">
                            {tool.applicable_tasks.map((task: string, i: number) => (
                              <span 
                                key={i}
                                className="bg-secondary text-foreground text-sm rounded-full px-3 py-1"
                              >
                                {task}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="reviews" className="mt-6">
                    <ReviewsList />
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="space-y-6">
                <div className="border rounded-xl p-6 sticky top-24">
                  <div className="flex items-center gap-2 mb-4">
                    {averageRating ? (
                      <>
                        <div className="flex">
                          <RatingStars rating={Math.round(averageRating)} />
                        </div>
                        <span className="font-medium">{averageRating}</span>
                        <span className="text-muted-foreground">
                          ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={18}
                              className="text-muted-foreground/30"
                            />
                          ))}
                        </div>
                        <span className="text-muted-foreground">No reviews yet</span>
                      </>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={handleVisitWebsite}
                    >
                      Visit Website
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-2">Quick Info</h3>
                      <ul className="space-y-2 text-sm">
                        {tool.primary_task && (
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Category</span>
                            <span>{tool.primary_task}</span>
                          </li>
                        )}
                        
                        {tool.pricing && (
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Pricing</span>
                            <span>{tool.pricing}</span>
                          </li>
                        )}
                        
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Reviews</span>
                          <span>{reviews.length}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </MotionWrapper>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
