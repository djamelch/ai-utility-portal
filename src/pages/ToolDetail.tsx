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
        
        // Try all methods of fetching to maximize chances of finding the tool
        let toolData = null;
        let toolError = null;
        
        // First try with the slug exactly as provided
        const slugResult = await supabase
          .from('tools')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();
          
        toolData = slugResult.data;
        toolError = slugResult.error;
        
        // If no tool found by exact slug, try to format the slug for common formats
        if (!toolData && !toolError) {
          console.log("No tool found by exact slug, trying with formatted slug");
          
          // Try with hyphens replaced with spaces (if contains hyphens)
          if (slug.includes('-')) {
            const formattedSlug = slug.replace(/-/g, ' ');
            console.log("Trying formatted slug:", formattedSlug);
            
            const formattedSlugResult = await supabase
              .from('tools')
              .select('*')
              .eq('slug', formattedSlug)
              .maybeSingle();
              
            if (formattedSlugResult.data) {
              toolData = formattedSlugResult.data;
              console.log("Found tool with formatted slug:", formattedSlug);
            }
          }
        }
        
        // If still no tool found and slug looks like a number, try by ID
        if (!toolData && !toolError && !isNaN(Number(slug))) {
          console.log("No tool found by slug, trying by ID:", slug);
          
          const idResult = await supabase
            .from('tools')
            .select('*')
            .eq('id', Number(slug))
            .maybeSingle();
            
          toolData = idResult.data;
          toolError = idResult.error;
        }
        
        // If still no tool found, try case insensitive search
        if (!toolData && !toolError) {
          console.log("No tool found by exact match, trying with company name");
          
          const nameResult = await supabase
            .from('tools')
            .select('*')
            .ilike('company_name', `%${slug}%`)
            .limit(1)
            .single();
            
          toolData = nameResult.data;
          toolError = nameResult.error;
        }
        
        if (toolError) {
          console.error('Error fetching tool:', toolError);
          throw toolError;
        }
        
        if (!toolData) {
          console.error('Tool not found with any method. Slug/ID:', slug);
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
          title: 'خطأ في جلب الأداة',
          description: 'فشل في تحميل تفاصيل الأداة. يرجى المحاولة مرة أخرى.',
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
        title: 'خطأ',
        description: 'فشل في تحميل التقييمات',
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
          title: "التحقق من الهوية مطلوب",
          description: "الرجاء تسجيل الدخول لإرسال تقييم",
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
          title: "تم تحديث التقييم",
          description: "تم تحديث تقييمك بنجاح",
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
          title: "تم إرسال التقييم",
          description: "شكراً على رأيك!",
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
        title: "خطأ",
        description: "فشل في إرسال تقييمك. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذا التقييم؟")) return;
    
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);
      
      if (error) throw error;
      
      toast({
        title: "تم الحذف",
        description: "تم حذف تقييمك",
      });
      
      fetchReviews(tool.id);
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف التقييم",
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
          سجل دخول لكتابة تقييم
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
          تعديل تقييمك
        </Button>
      );
    }
    
    return (
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogTrigger asChild>
          <Button>كتابة تقييم</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingReviewId ? 'تعديل تقييمك' : 'كتابة تقييم'}
            </DialogTitle>
            <DialogDescription>
              شارك تجربتك مع {tool?.company_name} لمساعدة الآخرين.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rating">التقييم</Label>
              <StarRating />
            </div>
            <div className="space-y-2">
              <Label htmlFor="review">تقييمك</Label>
              <Textarea
                id="review"
                placeholder="ما الذي أعجبك أو لم يعجبك في هذه الأداة؟"
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
              إلغاء
            </Button>
            <Button 
              onClick={handleReviewSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {editingReviewId ? 'جار التحديث...' : 'جار الإرسال...'}
                </>
              ) : editingReviewId ? 'تحديث التقييم' : 'إرسال التقييم'}
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
          <h3 className="text-lg font-medium mb-2">لا توجد تقييمات حتى الآن</h3>
          <p className="text-muted-foreground mb-6">
            كن أول من يقيم هذه الأداة وساعد الآخرين في اتخاذ قرارات أفضل.
          </p>
          {renderReviewButton()}
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">
            {reviews.length} {reviews.length === 1 ? 'تقييم' : 'تقييمات'}
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
                <h1 className="text-4xl font-bold mb-4">الأداة غير موجودة</h1>
                <p className="text-muted-foreground mb-8">
                  الأداة التي تبحث عنها غير موجودة أو تم إزالتها.
                </p>
                <Button onClick={() => navigate('/tools')}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  العودة إلى الأدوات
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
            <h1 className="text-2xl font-bold mb-4">حدث خطأ ما</h1>
            <p className="text-muted-foreground mb-6">فشل في تحميل تفاصيل الأداة.</p>
            <Button onClick={() => window.location.reload()}>إعادة المحاولة</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      <SEOHead
        title={tool ? `${tool.company_name} - تفاصيل الأداة` : 'الأداة غير موجودة'}
        description={tool ? (tool.short_description || `تعرف على ${tool.company_name}، ميزاتها، والأسعار، وتقييمات المستخدمين.`) : 'الأداة غير موجودة أو تم إزالتها.'}
        keywords={tool ? `${tool.company_name}, أداة ذكاء اصطناعي, ${tool.primary_task || ''}, ${tool.pricing || ''}, برنامج ذكاء اصطناعي` : 'أداة ذكاء اصطناعي, غير موجودة'}
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
              العودة إلى الأدوات
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
                    <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                    <TabsTrigger value="details">التفاصيل</TabsTrigger>
                    <TabsTrigger value="reviews">التقييمات</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="mt-6">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-3">حول الأداة</h2>
                        <p className="text-muted-foreground whitespace-pre-line">
                          {tool.full_description || tool.short_description || "لا يوجد وصف متاح."}
                        </p>
                      </div>
                      
                      {(tool.pros && tool.pros.length > 0) || (tool.cons && tool.cons.length > 0) ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {tool.pros && tool.pros.length > 0 && (
                            <div className="space-y-2">
                              <h3 className="font-medium">المزايا</h3>
                              <ul className="space-y-1">
                                {tool.pros.map((pro: string, i: number) => (
                                  <li key={i} className="flex items-start">
                                    <span className="text-green-500 ml-2">✓</span>
                                    <span>{pro}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {tool.cons && tool.cons.length > 0 && (
                            <div className="space-y-2">
                              <h3 className="font-medium">العيوب</h3>
                              <ul className="space-y-1">
                                {tool.cons.map((con: string, i: number) => (
                                  <li key={i} className="flex items-start">
                                    <span className="text-red-500 ml-2">✗</span>
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
                          <h2 className="text-xl font-semibold mb-3">الأسئلة الشائعة</h2>
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
                        <h2 className="text-xl font-semibold mb-3">التفاصيل التقنية</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                          {tool.primary_task && (
                            <div className="flex items-center gap-2">
                              <Tag className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">المهمة الأساسية</p>
                                <p className="text-sm text-muted-foreground">{tool.primary_task}</p>
                              </div>
                            </div>
                          )}
                          
                          {tool.pricing && (
                            <div className="flex items-center gap-2">
                              <Tag className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">نموذج التسعير</p>
                                <p className="text-sm text-muted-foreground">{tool.pricing}</p>
                              </div>
                            </div>
                          )}
                          
                          {tool.created_at && (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">تمت الإضافة في</p>
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
                                <p className="text-sm font-medium">آخر تحديث</p>
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
                          <h3 className="font-medium mb-2">المهام التطبيقية</h3>
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
                          ({reviews.length} {reviews.length === 1 ? 'تقييم' : 'تقييمات'})
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
                        <span className="text-muted-foreground">لا توجد تقييمات بعد</span>
                      </>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={handleVisitWebsite}
                    >
                      زيارة الموقع
                      <ExternalLink className="mr-2 h-4 w-4" />
                    </Button>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-2">معلومات سريعة</h3>
                      <ul className="space-y-2 text-sm">
                        {tool.primary_task && (
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">الفئة</span>
                            <span>{tool.primary_task}</span>
                          </li>
                        )}
                        
                        {tool.pricing && (
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">التسعير</span>
                            <span>{tool.pricing}</span>
                          </li>
                        )}
                        
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">التقييمات</span>
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
