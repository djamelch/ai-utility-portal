
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
  const [visibleCount, setVisibleCount] = useState(3);
  
  // Monitor window width to determine visible items count
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
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
    <div className={cn("w-full py-8", className)}>
      {(title || description) && (
        <div className="text-center mb-10">
          {title && (
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{title}</h2>
          )}
          {description && (
            <p className="text-muted-foreground max-w-2xl mx-auto">{description}</p>
          )}
        </div>
      )}
      
      <div className="relative">
        <div
          ref={containerRef}
          className="flex overflow-hidden px-4"
        >
          {tools.map((tool, index) => {
            // Calculate if the tool is visible now
            const isVisible = index >= currentIndex && index < currentIndex + visibleCount;
            
            return (
              <div
                key={tool.id}
                className={cn(
                  "transition-all duration-500 ease-in-out flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 p-4",
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
                      <span className="px-2 py-1 bg-accent text-white text-xs rounded-full font-medium">
                        جديد
                      </span>
                    ) : tool.isVerified ? (
                      <span className="px-2 py-1 bg-primary text-white text-xs rounded-full font-medium">
                        موثق
                      </span>
                    ) : null
                  }
                >
                  <div className="flex flex-col h-full gap-4">
                    <div className="flex items-center justify-between">
                      <AnimatedLogo 
                        text={tool.name}
                        icon={tool.logo ? (
                          <img src={tool.logo} alt={tool.name} className="w-10 h-10 rounded-md" />
                        ) : null}
                      />
                      
                      {tool.rating && (
                        <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-md">
                          <Star size={16} className="text-primary fill-primary" />
                          <span className="text-sm font-medium">{tool.rating}</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground flex-grow">
                      {tool.description}
                    </p>
                    
                    {tool.category && (
                      <div className="text-xs px-2 py-1 rounded-full bg-secondary w-fit">
                        {tool.category}
                      </div>
                    )}
                    
                    {tool.url && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-auto w-full"
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
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur-sm"
        >
          <ChevronLeft size={20} />
        </Button>
        
        <Button
          onClick={next}
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur-sm"
        >
          <ChevronRight size={20} />
        </Button>
        
        {/* Slide indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: Math.ceil(tools.length / visibleCount) }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i * visibleCount)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                Math.floor(currentIndex / visibleCount) === i
                  ? "bg-primary w-6"
                  : "bg-primary/30"
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
