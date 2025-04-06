
import { useNavigate } from 'react-router-dom';
import { ToolGrid } from '@/components/tools/ToolGrid';
import { Button } from '@/components/ui/button';

interface ToolsSectionProps {
  title?: string;
  description?: string;
  viewAllLink?: string;
  queryType?: "featured" | "top-rated" | "recent" | "popular";
}

export function ToolsSection({ 
  title = "Popular Tools", 
  description = "Explore the most popular AI tools in our directory",
  viewAllLink = "/tools",
  queryType = "popular" 
}: ToolsSectionProps) {
  const navigate = useNavigate();

  return (
    <section className="py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold">{title}</h2>
          {description && <p className="text-lg text-muted-foreground mt-2">{description}</p>}
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate(viewAllLink)}
          className="mt-4 sm:mt-0"
        >
          View all
        </Button>
      </div>
      
      <ToolGrid 
        limit={8} 
        queryType={queryType} 
        columnsPerRow={4}
      />
    </section>
  );
}
