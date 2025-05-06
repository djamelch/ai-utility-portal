
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface TextCyclerProps {
  texts: string[];
  interval?: number;
  className?: string;
}

export function TextCycler({ 
  texts, 
  interval = 3000, 
  className 
}: TextCyclerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const cycleTimer = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Initial setup to show the first text right away
    if (!isInitialized && texts.length > 0) {
      setIsInitialized(true);
    }
    
    // If there's only one text or no texts, no need to cycle
    if (texts.length <= 1) return;
    
    // Update text periodically
    const updateText = () => {
      setIsAnimating(true);
      
      // Wait for exit animation to complete before changing text
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        
        // Short delay before starting the entrance animation
        setTimeout(() => {
          setIsAnimating(false);
        }, 50);
      }, 500);
    };
    
    // Set up timer for subsequent updates
    cycleTimer.current = setInterval(updateText, interval);
    
    // Clean up timer when component is removed
    return () => {
      if (cycleTimer.current) {
        clearInterval(cycleTimer.current);
      }
    };
  }, [texts, interval, isInitialized]);
  
  // Don't render anything if there are no texts
  if (texts.length === 0) return null;
  
  return (
    <span 
      className={cn(
        "inline-block relative overflow-hidden",
        className
      )}
    >
      <span 
        className={cn(
          "inline-block transition-all duration-500 font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent",
          isAnimating 
            ? "opacity-0 transform translate-y-4" 
            : "opacity-100 transform translate-y-0"
        )}
        aria-live="polite"
      >
        {texts[currentIndex]}
      </span>
      
      {/* Animated underline effect with simplified colors */}
      <span className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary via-primary/80 to-primary bg-[length:200%_auto] animate-shimmer"></span>
    </span>
  );
}
