
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookmarkX, PenSquare, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Review type definition
interface UserReview {
  id: string;
  tool_id: number;
  rating: number;
  comment: string | null;
  tool_name: string;
  created_at: string;
}

interface UserReviewsListProps {
  userReviews: UserReview[];
  isLoading: boolean;
  onEdit: (reviewId: string, toolId: number) => void;
  onDelete: (reviewId: string) => Promise<void>;
  refetchReviews: () => void;
}

export const UserReviewsList = ({ 
  userReviews, 
  isLoading, 
  onEdit, 
  onDelete,
  refetchReviews 
}: UserReviewsListProps) => {
  const navigate = useNavigate();
  
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
      />
    ));
  };

  const handleDeleteReview = async (reviewId: string) => {
    await onDelete(reviewId);
    refetchReviews();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (userReviews.length === 0) {
    return (
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
    );
  }

  return (
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
                onClick={() => onEdit(review.id, review.tool_id)}
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
  );
};
