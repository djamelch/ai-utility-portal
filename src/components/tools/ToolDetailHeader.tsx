
import { ExternalLink, Star, StarHalf, Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { MotionWrapper } from "../ui/MotionWrapper";

interface ToolDetailHeaderProps {
  logo: string;
  name: string;
  description: string;
  url: string;
  isFavorite: boolean;
  toggleFavorite: () => void;
  averageRating: number;
  reviewCount: number;
}

export function ToolDetailHeader({
  logo,
  name,
  description,
  url,
  isFavorite,
  toggleFavorite,
  averageRating,
  reviewCount,
}: ToolDetailHeaderProps) {
  return (
    <MotionWrapper animation="fadeIn">
      <div className="flex flex-col gap-4 md:flex-row md:items-start mb-8">
        <div className="flex-shrink-0">
          <Avatar className="w-24 h-24 rounded-xl border border-border">
            <img src={logo || '/placeholder.svg'} alt={name} className="object-cover" />
          </Avatar>
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
            <h1 className="text-3xl font-bold">{name}</h1>
            <div className="flex gap-2 flex-wrap">
              <Button onClick={toggleFavorite} variant="outline" className="gap-2">
                {isFavorite ? (
                  <>
                    <BookmarkCheck className="h-4 w-4 text-primary" />
                    Saved
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4" />
                    Save
                  </>
                )}
              </Button>
              <Button asChild>
                <a href={url} target="_blank" rel="noopener noreferrer" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Visit Website
                </a>
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => {
                if (star <= Math.floor(averageRating)) {
                  return <Star key={star} className="h-4 w-4 text-yellow-500" fill="currentColor" />;
                } else if (star - 0.5 <= averageRating) {
                  return <StarHalf key={star} className="h-4 w-4 text-yellow-500" fill="currentColor" />;
                } else {
                  return <Star key={star} className="h-4 w-4 text-gray-300" />;
                }
              })}
            </div>
            <span className="text-sm text-muted-foreground">
              ({averageRating.toFixed(1)}) • {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
            </span>
          </div>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
    </MotionWrapper>
  );
}
