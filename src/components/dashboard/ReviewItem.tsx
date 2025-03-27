
import { useState } from 'react';
import { Star, PenSquare, BookmarkX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReviewItemProps {
  id: string;
  tool_id: number;
  tool_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
  onEdit: (reviewId: string, toolId: number) => void;
  onDelete: (reviewId: string) => void;
}

export function ReviewItem({
  id,
  tool_id,
  tool_name,
  rating,
  comment,
  created_at,
  onEdit,
  onDelete
}: ReviewItemProps) {
  return (
    <div className="py-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold mb-1">{tool_name}</h3>
          <div className="flex items-center gap-1 mb-2">
            {renderStars(rating)}
            <span className="text-sm text-muted-foreground ml-2">
              {created_at}
            </span>
          </div>
          {comment && (
            <p className="text-sm text-muted-foreground">
              {comment}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onEdit(id, tool_id)}
          >
            <PenSquare className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onDelete(id)}
          >
            <BookmarkX className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function renderStars(rating: number) {
  return Array(5).fill(0).map((_, i) => (
    <Star 
      key={i} 
      className={`h-4 w-4 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
    />
  ));
}
