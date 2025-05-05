
"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { MotionWrapper } from "./MotionWrapper";
import { 
  BarChart2, 
  Award, 
  TrendingUp, 
  Star, 
  Users, 
  ThumbsUp, 
  Zap, 
  Activity
} from "lucide-react";

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
  icon?: "chart" | "award" | "trending" | "star" | "users" | "thumbs" | "zap" | "activity" | "none";
  iconColor?: string;
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
  icon = "none",
  iconColor,
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
    const initialValue = Math.min(value * 0.1, 10); // Start from a small number
    setDisplayValue(initialValue);
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = easeOutExpo(progress); // Apply easing function
      setDisplayValue(Math.floor(initialValue + easedProgress * (value - initialValue)));
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };
    
    animationRef.current = requestAnimationFrame(step);
  };
  
  // Easing function for smoother animation
  const easeOutExpo = (x: number): number => {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  };
  
  const renderIcon = () => {
    const iconProps = {
      size: 24,
      className: cn("mb-2", iconColor ? iconColor : "text-primary"),
    };
    
    switch (icon) {
      case "chart":
        return <BarChart2 {...iconProps} />;
      case "award":
        return <Award {...iconProps} />;
      case "trending":
        return <TrendingUp {...iconProps} />;
      case "star":
        return <Star {...iconProps} />;
      case "users":
        return <Users {...iconProps} />;
      case "thumbs":
        return <ThumbsUp {...iconProps} />;
      case "zap":
        return <Zap {...iconProps} />;
      case "activity":
        return <Activity {...iconProps} />;
      case "none":
      default:
        return null;
    }
  };
  
  return (
    <div 
      ref={elementRef} 
      className={cn("text-center", className)}
    >
      {icon !== "none" && (
        <div className="flex justify-center">
          {renderIcon()}
        </div>
      )}
      <div 
        className={cn(
          "text-3xl md:text-4xl font-bold relative group",
          valueClassName
        )}
      >
        <span className="inline-block transform transition-transform group-hover:scale-110 duration-300">
          {prefix}{displayValue.toLocaleString()}{suffix}
        </span>
        {hasAnimated && (
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary/70 animate-ping" />
        )}
      </div>
      <div className={cn("text-muted-foreground mt-1", labelClassName)}>
        {label}
      </div>
    </div>
  );
}
