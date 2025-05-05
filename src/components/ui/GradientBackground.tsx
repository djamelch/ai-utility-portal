
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";

interface GradientBackgroundProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "accent" | "subtle" | "dynamic";
  interactive?: boolean;
  intensity?: "light" | "medium" | "strong";
}

export function GradientBackground({ 
  children, 
  className,
  variant = "primary",
  interactive = false,
  intensity = "medium"
}: GradientBackgroundProps) {
  const gradientStyles = {
    primary: "bg-gradient-to-br from-primary/5 via-accent/5 to-transparent",
    secondary: "bg-gradient-to-tr from-primary/5 via-background to-accent/5",
    accent: "bg-gradient-to-b from-accent/10 to-transparent",
    subtle: "bg-gradient-to-br from-secondary/80 via-background to-secondary/50",
    dynamic: "bg-gradient-to-br from-primary/5 via-accent/5 to-transparent"
  };
  
  const intensityClasses = {
    light: {
      primary: "from-primary/3 via-accent/3 to-transparent",
      secondary: "from-primary/3 via-background to-accent/3",
      accent: "from-accent/5 to-transparent",
      subtle: "from-secondary/30 via-background to-secondary/20"
    },
    medium: {
      primary: "from-primary/5 via-accent/5 to-transparent",
      secondary: "from-primary/5 via-background to-accent/5",
      accent: "from-accent/10 to-transparent",
      subtle: "from-secondary/50 via-background to-secondary/30"
    },
    strong: {
      primary: "from-primary/10 via-accent/10 to-transparent",
      secondary: "from-primary/10 via-background to-accent/10",
      accent: "from-accent/15 to-transparent",
      subtle: "from-secondary/70 via-background to-secondary/40"
    }
  };
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  
  useEffect(() => {
    if (!interactive || !containerRef.current) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      setPosition({ x, y });
    };
    
    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);
    
    const element = containerRef.current;
    
    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [interactive]);
  
  // Get the intensity class for the current variant
  const intensityClass = intensityClasses[intensity][variant === "dynamic" ? "primary" : variant];
  
  return (
    <div 
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
    >
      {variant === "dynamic" && interactive ? (
        <div 
          className={cn(
            "absolute inset-0 bg-gradient-radial transition-opacity duration-500",
            "from-primary/5 via-accent/5 to-transparent z-0",
            isHovering ? "opacity-100" : "opacity-0"
          )}
          style={{
            background: `radial-gradient(circle at ${position.x * 100}% ${position.y * 100}%, var(--primary) 0%, transparent 60%)`,
            opacity: isHovering ? 0.05 : 0
          }}
        />
      ) : (
        <div className={cn(
          "absolute inset-0", 
          gradientStyles[variant],
          intensityClass,
          variant === "dynamic" && "animate-pulse"
        )} />
      )}
      
      <div className="relative z-10">{children}</div>
    </div>
  );
}
