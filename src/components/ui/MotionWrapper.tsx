
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface MotionWrapperProps {
  children: React.ReactNode;
  className?: string;
  animation?: 
    | "fadeIn" 
    | "slideUp" 
    | "slideDown" 
    | "slideInRight" 
    | "scaleIn"
    | "none";
  delay?: "delay-100" | "delay-200" | "delay-300" | "delay-400" | "delay-500" | "none";
  threshold?: number;
  once?: boolean;
}

export function MotionWrapper({
  children,
  className,
  animation = "fadeIn",
  delay = "none",
  threshold = 0.1,
  once = true,
}: MotionWrapperProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const current = ref.current;
    
    if (!current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(current);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );
    
    observer.observe(current);
    
    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [once, threshold]);

  const animationClass = animation === "none" ? "" : `animate-${animation}`;
  const delayClass = delay === "none" ? "" : delay;

  return (
    <div
      ref={ref}
      className={cn(
        "opacity-0",
        isVisible && animationClass,
        isVisible && delayClass,
        className
      )}
    >
      {children}
    </div>
  );
}
