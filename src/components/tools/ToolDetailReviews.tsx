
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MotionWrapper } from "../ui/MotionWrapper";
import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ReviewProps {
  id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  user_email?: string;
  user_name?: string;
}

interface ToolDetailReviewsProps {
  reviews: ReviewProps[];
  renderStars: (rating: number) => React.ReactNode;
}

export function ToolDetailReviews({ reviews, renderStars }: ToolDetailReviewsProps) {
  const [displayCount, setDisplayCount] = useState(5);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleEditReview = (reviewId: string) => {
    navigate(location.pathname, { state: { editReviewId: reviewId } });
  };

  return (
    <MotionWrapper animation="fadeIn" delay="delay-200">
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-10 border border-dashed rounded-xl">
            <p className="text-muted-foreground">No reviews yet. Be the first to review this tool!</p>
          </div>
        ) : (
          <>
            {reviews.slice(0, displayCount).map((review) => (
              <div key={review.id} className="border border-border/50 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground text-sm font-medium">
                        {review.user_name ? review.user_name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    </Avatar>
                    <div>
                      <div className="font-medium">{review.user_name || 'Anonymous User'}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {user && user.id === review.user_id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditReview(review.id)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit Review</span>
                    </Button>
                  )}
                </div>
                <div className="flex">{renderStars(review.rating)}</div>
                {review.comment && <p>{review.comment}</p>}
              </div>
            ))}
            
            {reviews.length > displayCount && (
              <div className="text-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => setDisplayCount(prevCount => prevCount + 5)}
                >
                  Load More Reviews
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </MotionWrapper>
  );
}
