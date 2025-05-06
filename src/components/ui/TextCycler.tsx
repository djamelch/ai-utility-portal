
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
    // إذا كان هناك نص واحد فقط أو بدون نصوص، لا داعي لتطبيق أي تحريك
    if (texts.length <= 1) return;
    
    // دالة تحديث النص
    const updateText = () => {
      setIsAnimating(true);
      
      // انتظار انتهاء حركة الخروج قبل تغيير النص
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setIsAnimating(false);
      }, 500); // نصف مدة الانتقال الكلية
    };
    
    // البدء بالنص الأول بدون تأخير
    setIsAnimating(false);
    
    // إعداد مؤقت للتحديثات اللاحقة
    cycleTimer.current = setInterval(updateText, interval);
    
    // تنظيف المؤقت عند إزالة المكون
    return () => {
      if (cycleTimer.current) {
        clearInterval(cycleTimer.current);
      }
    };
  }, [texts, interval]);
  
  // لا تعرض أي شيء إذا لم تكن هناك نصوص
  if (texts.length === 0) return null;
  
  return (
    <span className={cn("inline-block relative", className)}>
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
