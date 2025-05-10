
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";

interface GradientBackgroundProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "accent" | "subtle" | "dynamic";
  interactive?: boolean;
  intensity?: "light" | "medium" | "strong";
  followCursor?: boolean;
  id?: string; // Added id prop
}

export function GradientBackground({ 
  children, 
  className,
  variant = "primary",
  interactive = false,
  intensity = "medium",
  followCursor = false,
  id // Added id prop
}: GradientBackgroundProps) {
  // Updated gradient styles with more harmonious colors
  const gradientStyles = {
    primary: "bg-gradient-to-br from-primary/10 via-background to-accent/5",
    secondary: "bg-gradient-to-tr from-background via-secondary/20 to-background",
    accent: "bg-gradient-to-b from-primary/10 via-background to-accent/5",
    subtle: "bg-gradient-to-br from-secondary/40 via-background to-secondary/20",
    dynamic: "bg-gradient-to-br from-primary/5 via-accent/5 to-transparent"
  };
  
  // Updated intensity classes for better color harmony
  const intensityClasses = {
    light: {
      primary: "from-primary/5 via-background to-accent/3",
      secondary: "from-background via-secondary/10 to-background",
      accent: "from-primary/5 via-background to-accent/3",
      subtle: "from-secondary/20 via-background to-secondary/10"
    },
    medium: {
      primary: "from-primary/8 via-background to-accent/5",
      secondary: "from-background via-secondary/15 to-background",
      accent: "from-primary/8 via-background to-accent/5",
      subtle: "from-secondary/30 via-background to-secondary/15"
    },
    strong: {
      primary: "from-primary/12 via-background to-accent/8",
      secondary: "from-background via-secondary/25 to-background",
      accent: "from-primary/12 via-background to-accent/8",
      subtle: "from-secondary/40 via-background to-secondary/20"
    }
  };
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0.5, y: 0.5 });
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
    const handleMouseLeave = () => {
      setIsHovering(false);
      // Reset to center when mouse leaves
      setPosition({ x: 0.5, y: 0.5 });
    };
    
    const element = containerRef.current;
    
    if (followCursor) {
      element.addEventListener("mousemove", handleMouseMove);
      element.addEventListener("mouseenter", handleMouseEnter);
      element.addEventListener("mouseleave", handleMouseLeave);
    }
    
    return () => {
      if (followCursor) {
        element.removeEventListener("mousemove", handleMouseMove);
        element.removeEventListener("mouseenter", handleMouseEnter);
        element.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [interactive, followCursor]);
  
  // Get the intensity class for the current variant
  const intensityClass = intensityClasses[intensity][variant === "dynamic" ? "primary" : variant];
  
  return (
    <div 
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      id={id} // Use the id prop
    >
      {variant === "dynamic" && interactive ? (
        <div 
          className={cn(
            "absolute inset-0 bg-gradient-radial transition-opacity duration-500",
            "from-primary/8 via-accent/5 to-transparent z-0",
            isHovering ? "opacity-100" : "opacity-0"
          )}
          style={{
            background: `radial-gradient(circle at ${position.x * 100}% ${position.y * 100}%, var(--primary) 0%, transparent 60%)`,
            opacity: isHovering ? 0.1 : 0
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
      
      {/* Grid pattern for subtle texture with reduced opacity */}
      <div 
        className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzQwNDA0MCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"
        style={{ opacity: 0.03 }}
      />
      
      <div className="relative z-10">{children}</div>
    </div>
  );
}
