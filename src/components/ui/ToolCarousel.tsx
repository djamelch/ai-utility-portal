
import { useState, useRef, useEffect } from "react";
import { Button } from "./button";
import { GlassCard } from "./GlassCard";
import { AnimatedLogo } from "./AnimatedLogo";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Tool {
  id: string | number;
  name?: string;
  description?: string;
  logo?: string;
  rating?: number;
  category?: string;
  isNew?: boolean;
  isVerified?: boolean;
  url?: string;
}

interface ToolCarouselProps {
  tools: Tool[];
  title?: string;
  description?: string;
  className?: string;
}

export function ToolCarousel({
  tools,
  title,
  description,
  className
}: ToolCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(4); // Increased from 3 to 4
  
  // Monitor window width to determine visible items count
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 768) {
        setVisibleCount(2);
      } else if (window.innerWidth < 1280) {
        setVisibleCount(3);
      } else {
        setVisibleCount(4); // Show 4 items on larger screens
      }
    };
    
    // Update on load
    updateVisibleCount();
    
    // Update on window resize
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);
  
  const next = () => {
    setCurrentIndex(prev => 
      prev + visibleCount >= tools.length ? 0 : prev + 1
    );
  };
  
  const prev = () => {
    setCurrentIndex(prev => 
      prev <= 0 ? Math.max(0, tools.length - visibleCount) : prev - 1
    );
  };
  
  // Auto-scroll
  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, visibleCount, tools.length]);
  
  return (
    <div className={cn("w-full py-6", className)}>
      {(title || description) && (
        <div className="text-center mb-6">
          {title && (
            <h2 className="text-2xl md:text-3xl font-bold mb-1">{title}</h2>
          )}
          {description && (
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">{description}</p>
          )}
        </div>
      )}
      
      <div className="relative">
        <div
          ref={containerRef}
          className="flex overflow-hidden px-3"
        >
          {tools.map((tool, index) => {
            // Calculate if the tool is visible now
            const isVisible = index >= currentIndex && index < currentIndex + visibleCount;
            
            return (
              <div
                key={tool.id}
                className={cn(
                  "transition-all duration-500 ease-in-out flex-shrink-0 w-full sm:w-1/2 md:w-1/3 xl:w-1/4 p-2", // Updated for 4 columns
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full absolute"
                )}
                style={{
                  transform: isVisible ? `translateX(${(index - currentIndex) * 100}%)` : "",
                  position: isVisible ? "relative" : "absolute"
                }}
              >
                <GlassCard 
                  className="h-full"
                  glowEffect
                  badge={
                    tool.isNew ? (
                      <span className="px-1.5 py-0.5 bg-primary text-white text-xs rounded-full font-medium">
                        جديد
                      </span>
                    ) : tool.isVerified ? (
                      <span className="px-1.5 py-0.5 bg-primary/70 text-white text-xs rounded-full font-medium">
                        موثق
                      </span>
                    ) : null
                  }
                >
                  <div className="flex flex-col h-full gap-3 p-2"> {/* Added padding and reduced gap */}
                    <div className="flex items-center justify-between">
                      <AnimatedLogo 
                        text={tool.name}
                        icon={tool.logo ? (
                          <img src={tool.logo} alt={tool.name} className="w-8 h-8 rounded-md" />
                        ) : null}
                        className="text-sm" // Reduced text size
                      />
                      
                      {tool.rating && (
                        <div className="flex items-center gap-0.5 bg-primary/10 px-1.5 py-0.5 rounded-md">
                          <Star size={12} className="text-primary fill-primary" />
                          <span className="text-xs font-medium">{tool.rating}</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground flex-grow line-clamp-2 leading-relaxed">
                      {tool.description}
                    </p>
                    
                    {tool.category && (
                      <div className="text-2xs px-1.5 py-0.5 rounded-full bg-secondary w-fit">
                        {tool.category}
                      </div>
                    )}
                    
                    {tool.url && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-auto w-full h-7 text-xs hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                      >
                        عرض الأداة
                      </Button>
                    )}
                  </div>
                </GlassCard>
              </div>
            );
          })}
        </div>
        
        {/* Navigation buttons */}
        <Button
          onClick={prev}
          variant="outline"
          size="icon"
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 rounded-full w-7 h-7 bg-background/80 backdrop-blur-sm hover:bg-primary/10 hover:text-primary hover:border-primary/30"
        >
          <ChevronLeft size={16} />
        </Button>
        
        <Button
          onClick={next}
          variant="outline"
          size="icon"
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 rounded-full w-7 h-7 bg-background/80 backdrop-blur-sm hover:bg-primary/10 hover:text-primary hover:border-primary/30"
        >
          <ChevronRight size={16} />
        </Button>
        
        {/* Slide indicators */}
        <div className="flex justify-center gap-1.5 mt-4">
          {Array.from({ length: Math.ceil(tools.length / visibleCount) }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i * visibleCount)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                Math.floor(currentIndex / visibleCount) === i
                  ? "bg-primary w-5"
                  : "bg-primary/30 w-1.5"
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
