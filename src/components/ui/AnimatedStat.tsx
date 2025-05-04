
"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { MotionWrapper } from "./MotionWrapper";

interface AnimatedStatProps {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
  disableAnimation?: boolean;
}

export function AnimatedStat({
  value,
  label,
  prefix = "",
  suffix = "",
  duration = 2000,
  className,
  labelClassName,
  valueClassName,
  disableAnimation = false,
}: AnimatedStatProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  useEffect(() => {
    if (disableAnimation) {
      setDisplayValue(value);
      return;
    }
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          startAnimation();
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );
    
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    
    return () => {
      observer.disconnect();
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration, disableAnimation, hasAnimated]);
  
  const startAnimation = () => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setDisplayValue(Math.floor(progress * value));
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };
    
    animationRef.current = requestAnimationFrame(step);
  };
  
  return (
    <div 
      ref={elementRef} 
      className={cn("text-center", className)}
    >
      <div className={cn("text-3xl md:text-4xl font-bold", valueClassName)}>
        {prefix}{displayValue.toLocaleString()}{suffix}
      </div>
      <div className={cn("text-muted-foreground mt-1", labelClassName)}>
        {label}
      </div>
    </div>
  );
}
