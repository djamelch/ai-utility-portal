
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TextCyclerProps {
  texts: string[];
  interval?: number;
  className?: string;
}

export function TextCycler({ 
  texts, 
  interval = 2000, 
  className 
}: TextCyclerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (texts.length <= 1) return;
    
    // Initial setup to ensure component is visible immediately
    setIsAnimating(false);
    
    const timer = setInterval(() => {
      setIsAnimating(true);
      
      // Wait for exit animation to complete before changing text
      const animationTimeout = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setIsAnimating(false);
      }, 300); // Half of the transition duration
      
      return () => clearTimeout(animationTimeout);
    }, interval);
    
    return () => clearInterval(timer);
  }, [texts, interval]);
  
  if (texts.length === 0) return null;
  
  return (
    <span className={cn("inline-block relative", className)}>
      <span 
        className={cn(
          "inline-block transition-all duration-600",
          isAnimating ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0"
        )}
      >
        {texts[currentIndex]}
      </span>
    </span>
  );
}
