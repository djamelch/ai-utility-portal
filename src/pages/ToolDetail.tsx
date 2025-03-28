
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink, Star, User, Calendar, Tag, Clock, ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ToolDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tool, setTool] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [userReview, setUserReview] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchTool = async () => {
      setLoading(true);
      setNotFound(false);
      
      try {
        let query = supabase.from('tools').select('*');
        
        // Only query by slug
        if (slug) {
          query = query.eq('slug', slug);
        }
        
        const { data, error } = await query.maybeSingle();
        
        if (error) {
          throw error;
        }
        
        if (!data) {
          console.error('Tool not found with slug:', slug);
          setNotFound(true);
          return;
        }
        
        console.log('Tool data:', data);
        setTool(data);
      } catch (error) {
        console.error('Error fetching tool:', error);
        toast({
          title: 'Error fetching tool',
          description: 'Failed to load tool details',
          variant: 'destructive',
        });
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTool();
  }, [slug, toast]);
  
  const handleVisitWebsite = async () => {
    if (!tool) return;
    
    try {
      // Increment click count
      await supabase.rpc('increment_tool_click_count', { tool_id: tool.id });
      
      // Open website in new tab
      const url = tool.visit_website_url || tool.detail_url || '#';
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };
  
  const handleReviewSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to submit a review",
          variant: "destructive",
        });
        setReviewDialogOpen(false);
        return;
      }
      
      // Submit the review
      const { error } = await supabase.from('reviews').insert({
        tool_id: tool.id,
        user_id: session.user.id,
        rating: userRating,
        comment: userReview
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
      
      // Reset form and close dialog
      setUserReview('');
      setUserRating(5);
      setReviewDialogOpen(false);
      
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
  
  // Star rating component for the review form
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
                  The tool you're looking for doesn't exist or has been removed.
                </p>
                <Button onClick={() => navigate('/tools')}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to Tools
                </Button>
              </div>
            </MotionWrapper>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col">
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
              {/* Main content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Header */}
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
                
                {/* Featured image */}
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
                
                {/* Tabs */}
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="mt-6">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-3">About</h2>
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
                      
                      {tool.faqs && Object.keys(tool.faqs).length > 0 && (
                        <div>
                          <h2 className="text-xl font-semibold mb-3">Frequently Asked Questions</h2>
                          <div className="space-y-4">
                            {Array.isArray(tool.faqs) ? 
                              tool.faqs.map((faq: any, i: number) => (
                                <div key={i} className="border rounded-lg p-4">
                                  <h3 className="font-medium mb-2">{faq.question}</h3>
                                  <p className="text-muted-foreground">{faq.answer}</p>
                                </div>
                              )) : 
                              Object.entries(tool.faqs).map(([key, value]: [string, any], i: number) => (
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
                                <p className="text-sm font-medium">Added on</p>
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
                                <p className="text-sm font-medium">Last Updated</p>
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
                    <div className="text-center py-8">
                      <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No Reviews Yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Be the first to review this tool and help others make better decisions.
                      </p>
                      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                        <DialogTrigger asChild>
                          <Button>Write a Review</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Write a Review</DialogTitle>
                            <DialogDescription>
                              Share your experience with {tool.company_name} to help others.
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
                              onClick={() => setReviewDialogOpen(false)}
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
                                  Submitting...
                                </>
                              ) : 'Submit Review'}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Sidebar */}
              <div className="space-y-6">
                <div className="border rounded-xl p-6 sticky top-24">
                  <div className="flex items-center gap-2 mb-4">
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
                          <span>0</span>
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
