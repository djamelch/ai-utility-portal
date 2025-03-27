
import { useState } from 'react';
import { Heart, Star, UserCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SavedToolsList } from './SavedToolsList';
import { UserReviewsList } from './UserReviewsList';
import { UserProfileSection } from './UserProfileSection';

// Tool type definition
interface SavedTool {
  id: number;
  name: string;
  short_description: string;
  logo_url: string | null;
  primary_task: string | null;
  pricing: string | null;
  favorite_id: string;
  slug?: string;
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

interface DashboardTabsProps {
  savedTools: SavedTool[];
  userReviews: UserReview[];
  isLoadingSaved: boolean;
  isLoadingReviews: boolean;
  onRemoveSaved: (favoriteId: string) => Promise<void>;
  onEditReview: (reviewId: string, toolId: number) => void;
  onDeleteReview: (reviewId: string) => Promise<void>;
  refetchSavedTools: () => void;
  refetchUserReviews: () => void;
}

export const DashboardTabs = ({ 
  savedTools, 
  userReviews, 
  isLoadingSaved, 
  isLoadingReviews, 
  onRemoveSaved, 
  onEditReview, 
  onDeleteReview, 
  refetchSavedTools, 
  refetchUserReviews 
}: DashboardTabsProps) => {
  const [activeTab, setActiveTab] = useState('saved');

  return (
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
            <SavedToolsList 
              savedTools={savedTools} 
              isLoading={isLoadingSaved} 
              onRemove={onRemoveSaved}
              refetchTools={refetchSavedTools}
            />
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
            <UserReviewsList 
              userReviews={userReviews} 
              isLoading={isLoadingReviews} 
              onEdit={onEditReview}
              onDelete={onDeleteReview}
              refetchReviews={refetchUserReviews}
            />
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
            <UserProfileSection />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
