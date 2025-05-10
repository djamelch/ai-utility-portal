
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
  const [isVisible, setIsVisible] = useState(animation === "none");
  const [isBrowser, setIsBrowser] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Check if we're in a browser environment
  useEffect(() => {
    setIsBrowser(true);
    
    // If animation is "none", set isVisible to true immediately
    if (animation === "none") {
      setIsVisible(true);
    }
  }, [animation]);

  useEffect(() => {
    // Skip in non-browser environments or if animation is "none"
    if (!isBrowser || animation === "none") {
      return;
    }
    
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
  }, [once, threshold, isBrowser, animation]);

  const animationClass = animation === "none" ? "" : `animate-${animation}`;
  const delayClass = delay === "none" ? "" : delay;

  // For debugging
  useEffect(() => {
    // console.log("MotionWrapper isVisible:", isVisible);
    // console.log("Animation class:", animationClass);
  }, [isVisible, animationClass]);

  // If we're not in a browser or animation is "none", render without opacity-0
  if (!isBrowser || animation === "none") {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={cn(
        isVisible ? "opacity-100" : "opacity-0",
        isVisible && animationClass,
        isVisible && delayClass,
        className
      )}
    >
      {children}
    </div>
  );
}
