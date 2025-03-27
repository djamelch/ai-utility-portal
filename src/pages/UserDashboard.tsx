
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { BookmarkX, Heart, Star, UserCircle, Loader2, PenSquare } from 'lucide-react';

// Tool type definition
interface SavedTool {
  id: number;
  name: string;
  short_description: string;
  logo_url: string | null;
  primary_task: string | null;
  pricing: string | null;
  favorite_id: string;
}

// Review type definition
interface UserReview {
  id: string;
  tool_id: number;
  rating: number;
  comment: string | null;
  tool_name: string;
  created_at: string;
}

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('saved');
  const [savedTools, setSavedTools] = useState<SavedTool[]>([]);
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchSavedTools();
      fetchUserReviews();
    }
  }, [user]);

  const fetchSavedTools = async () => {
    try {
      setIsLoadingSaved(true);
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          tool_id,
          tools (
            id,
            company_name,
            short_description,
            logo_url,
            primary_task,
            pricing
          )
        `)
        .eq('user_id', user?.id);

      if (error) throw error;

      // Transform the data to flatten the structure
      const formattedTools = data.map(item => ({
        id: item.tools.id,
        name: item.tools.company_name,
        short_description: item.tools.short_description,
        logo_url: item.tools.logo_url,
        primary_task: item.tools.primary_task,
        pricing: item.tools.pricing,
        favorite_id: item.id
      }));

      setSavedTools(formattedTools);
    } catch (error) {
      console.error('Error fetching saved tools:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your saved tools',
        variant: 'destructive'
      });
    } finally {
      setIsLoadingSaved(false);
    }
  };

  const fetchUserReviews = async () => {
    try {
      setIsLoadingReviews(true);
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          tool_id,
          rating,
          comment,
          created_at,
          tools (
            company_name
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data
      const formattedReviews = data.map(item => ({
        id: item.id,
        tool_id: item.tool_id,
        rating: item.rating,
        comment: item.comment,
        tool_name: item.tools.company_name,
        created_at: new Date(item.created_at).toLocaleDateString()
      }));

      setUserReviews(formattedReviews);
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your reviews',
        variant: 'destructive'
      });
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const handleRemoveSaved = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;

      setSavedTools(prev => prev.filter(tool => tool.favorite_id !== favoriteId));
      
      toast({
        title: 'Success',
        description: 'Tool removed from your saved list',
      });
    } catch (error) {
      console.error('Error removing saved tool:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove tool from saved list',
        variant: 'destructive'
      });
    }
  };

  const handleEditReview = (reviewId: string, toolId: number) => {
    navigate(`/tool/${toolId}`, { state: { editReviewId: reviewId } });
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      setUserReviews(prev => prev.filter(review => review.id !== reviewId));
      
      toast({
        title: 'Success',
        description: 'Review deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete review',
        variant: 'destructive'
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <RequireAuth>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        
        <main className="flex-1 pt-24 pb-16">
          <div className="container max-w-screen-xl mx-auto px-4">
            <MotionWrapper animation="fadeIn">
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold">
                  Your Dashboard
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Manage your saved tools, reviews, and personal settings
                </p>
              </div>
            </MotionWrapper>
            
            <MotionWrapper animation="fadeIn" delay="delay-200">
              <Tabs 
                defaultValue="saved" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="mb-6">
                  <TabsTrigger value="saved">
                    <Heart className="h-4 w-4 mr-2" />
                    Saved Tools
                  </TabsTrigger>
                  <TabsTrigger value="reviews">
                    <Star className="h-4 w-4 mr-2" />
                    Your Reviews
                  </TabsTrigger>
                  <TabsTrigger value="profile">
                    <UserCircle className="h-4 w-4 mr-2" />
                    Profile
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="saved" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Saved AI Tools</CardTitle>
                      <CardDescription>
                        These are the AI tools you've bookmarked for later reference
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoadingSaved ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : savedTools.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {savedTools.map(tool => (
                            <div key={tool.favorite_id} className="border rounded-lg overflow-hidden">
                              <div className="p-4">
                                <div className="flex justify-between items-start">
                                  <div className="flex gap-3 items-center">
                                    {tool.logo_url ? (
                                      <img 
                                        src={tool.logo_url} 
                                        alt={tool.name} 
                                        className="w-10 h-10 object-contain rounded"
                                      />
                                    ) : (
                                      <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                                        <span className="text-lg font-bold text-primary">
                                          {tool.name.charAt(0)}
                                        </span>
                                      </div>
                                    )}
                                    <h3 className="font-semibold">{tool.name}</h3>
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleRemoveSaved(tool.favorite_id)}
                                  >
                                    <BookmarkX className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                                  {tool.short_description}
                                </p>
                                <div className="mt-3 flex justify-between">
                                  {tool.primary_task && (
                                    <span className="text-xs px-2 py-1 bg-primary/10 rounded-full">
                                      {tool.primary_task}
                                    </span>
                                  )}
                                  {tool.pricing && (
                                    <span className="text-xs text-muted-foreground">
                                      {tool.pricing}
                                    </span>
                                  )}
                                </div>
                                <div className="mt-3">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="w-full"
                                    onClick={() => navigate(`/tool/${tool.id}`)}
                                  >
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Heart className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                          <h3 className="text-xl font-medium mb-2">No saved tools yet</h3>
                          <p className="text-muted-foreground mb-4">
                            You haven't saved any AI tools to your dashboard
                          </p>
                          <Button onClick={() => navigate('/tools')}>
                            Explore AI Tools
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="reviews" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Reviews</CardTitle>
                      <CardDescription>
                        Manage the reviews you've left for AI tools
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoadingReviews ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : userReviews.length > 0 ? (
                        <div className="divide-y">
                          {userReviews.map(review => (
                            <div key={review.id} className="py-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold mb-1">{review.tool_name}</h3>
                                  <div className="flex items-center gap-1 mb-2">
                                    {renderStars(review.rating)}
                                    <span className="text-sm text-muted-foreground ml-2">
                                      {review.created_at}
                                    </span>
                                  </div>
                                  {review.comment && (
                                    <p className="text-sm text-muted-foreground">
                                      {review.comment}
                                    </p>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleEditReview(review.id, review.tool_id)}
                                  >
                                    <PenSquare className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleDeleteReview(review.id)}
                                  >
                                    <BookmarkX className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Star className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                          <h3 className="text-xl font-medium mb-2">No reviews yet</h3>
                          <p className="text-muted-foreground mb-4">
                            You haven't reviewed any AI tools yet
                          </p>
                          <Button onClick={() => navigate('/tools')}>
                            Browse Tools to Review
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="profile" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Settings</CardTitle>
                      <CardDescription>
                        Manage your account settings and preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Account Information</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">Email</label>
                              <div className="mt-1 p-2 border rounded bg-muted/30">
                                {user?.email}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4">Account Actions</h3>
                          <div className="space-y-4">
                            <div>
                              <Button 
                                variant="outline" 
                                onClick={() => navigate('/auth')}
                                className="w-full sm:w-auto"
                              >
                                Update Password
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </MotionWrapper>
          </div>
        </main>
        
        <Footer />
      </div>
    </RequireAuth>
  );
}
