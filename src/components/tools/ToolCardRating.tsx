
import { Star } from "lucide-react";
import { FC } from "react";

interface ToolCardRatingProps {
  rating: number;
  reviewCount: number;
}

export const ToolCardRating: FC<ToolCardRatingProps> = ({ rating, reviewCount }) => {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < Math.round(rating) ? "fill-brand-400 text-brand-400" : "text-muted-foreground/30"}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        ({reviewCount} reviews)
      </span>
    </div>
  );
};
