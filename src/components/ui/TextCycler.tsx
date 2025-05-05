
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
  const cycleTimer = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (texts.length <= 1) return;
    
    // تحديث النص بشكل دوري
    const updateText = () => {
      setIsAnimating(true);
      
      // انتظار انتهاء حركة الخروج قبل تغيير النص
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setIsAnimating(false);
      }, 500); // نصف وقت الانتقال
    };
    
    // ابدأ بدون تأخير بالنص الأول
    setIsAnimating(false);
    
    // إعداد المؤقت للتحديثات اللاحقة
    cycleTimer.current = setInterval(updateText, interval);
    
    return () => {
      if (cycleTimer.current) {
        clearInterval(cycleTimer.current);
      }
    };
  }, [texts, interval]);
  
  if (texts.length === 0) return null;
  
  return (
    <span className={cn("inline-block relative overflow-hidden", className)}>
      <span 
        className={cn(
          "inline-block transition-all duration-500",
          isAnimating 
            ? "opacity-0 transform translate-y-4" 
            : "opacity-100 transform translate-y-0"
        )}
        aria-live="polite"
      >
        {texts[currentIndex]}
      </span>
    </span>
  );
}
