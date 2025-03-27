
import { FC } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";

interface ToolCardHeaderProps {
  name: string;
  logo: string;
  category: string;
  pricing: string;
  slug?: string;
}

export const ToolCardHeader: FC<ToolCardHeaderProps> = ({ 
  name, logo, category, pricing, slug 
}) => {
  const [imgError, setImgError] = useState(false);
  const placeholderImage = 'https://via.placeholder.com/80?text=AI+Tool';
  const toolSlug = slug || name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

  return (
    <div className="flex items-start gap-4">
      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-secondary/50">
        {!imgError ? (
          <img 
            src={logo || placeholderImage} 
            alt={`${name} logo`} 
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <img 
            src={placeholderImage} 
            alt={`${name} logo placeholder`} 
            className="h-full w-full object-cover"
          />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium truncate">
            <Link to={`/tool/${toolSlug}`} className="hover:text-primary transition-colors">
              {name}
            </Link>
          </h3>
        </div>
        
        <div className="mt-1 flex items-center gap-2">
          <span className="rounded-full bg-secondary/80 px-2.5 py-0.5 text-xs text-foreground/70">
            {category}
          </span>
          <span className="rounded-full bg-secondary/80 px-2.5 py-0.5 text-xs text-foreground/70">
            {pricing}
          </span>
        </div>
      </div>
    </div>
  );
};
