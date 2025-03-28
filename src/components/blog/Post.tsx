
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { Avatar } from "@/components/ui/avatar";
import { CalendarDays, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PostProps {
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  publishedAt: string;
  category: string;
  readingTime?: string;
  image?: string;
}

export function Post({ title, content, author, publishedAt, category, readingTime, image }: PostProps) {
  const formattedDate = new Date(publishedAt).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <MotionWrapper animation="fadeIn">
      <article className="max-w-screen-lg mx-auto">
        <div className="mb-8">
          <Badge variant="secondary" className="mb-4">
            {category}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
          
          <div className="flex items-center gap-4 text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                {author.avatar ? (
                  <img src={author.avatar} alt={author.name} />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
                    {author.name.charAt(0)}
                  </div>
                )}
              </Avatar>
              <span>{author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            {readingTime && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{readingTime}</span>
              </div>
            )}
          </div>
        </div>
        
        {image && (
          <div className="mb-8">
            <img 
              src={image} 
              alt={title} 
              className="w-full h-auto max-h-[500px] object-cover rounded-lg"
            />
          </div>
        )}
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {content}
        </div>
      </article>
    </MotionWrapper>
  );
}
