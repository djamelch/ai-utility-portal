
import { cn } from "@/lib/utils";
import { Sparkles, Loader2, RefreshCw, RotateCw } from "lucide-react";

interface ModernLoadingIndicatorProps {
  size?: "sm" | "md" | "lg";
  variant?: "dots" | "spinner" | "pulse" | "bars" | "sparkles";
  className?: string;
  textClassName?: string;
  text?: string;
  color?: string;
}

export function ModernLoadingIndicator({
  size = "md",
  variant = "dots", 
  className,
  textClassName,
  text,
  color
}: ModernLoadingIndicatorProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16"
  };
  
  const dotSizes = {
    sm: "h-1.5 w-1.5",
    md: "h-2 w-2",
    lg: "h-3 w-3"
  };
  
  const barSizes = {
    sm: "h-4 w-1",
    md: "h-6 w-1.5",
    lg: "h-8 w-2"
  };
  
  const colorClass = color || "bg-primary/80 text-primary";
  
  const renderLoader = () => {
    switch (variant) {
      case "dots":
        return (
          <div className="flex justify-center items-center gap-2">
            {[0, 1, 2].map((i) => (
              <div 
                key={i} 
                className={cn(
                  "rounded-full", 
                  colorClass.split(" ")[0],
                  "animate-bounce", 
                  dotSizes[size]
                )} 
                style={{
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: "0.7s"
                }}
              />
            ))}
          </div>
        );
      case "spinner":
        return (
          <div className="relative">
            <div
              className={cn(
                "rounded-full border-2 md:border-3 lg:border-4 border-background/30 border-t-primary animate-spin",
                sizeClasses[size]
              )}
            />
            {size === "lg" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <RefreshCw size={20} className="text-primary/50 animate-spin-slow" />
              </div>
            )}
          </div>
        );
      case "pulse":
        return (
          <div className="relative">
            <div
              className={cn(
                "rounded-full bg-primary/30 animate-ping absolute inset-0",
                sizeClasses[size]
              )}
            />
            <div
              className={cn(
                "rounded-full bg-primary relative",
                sizeClasses[size]
              )}
            />
          </div>
        );
      case "bars":
        return (
          <div className="flex items-end justify-center gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div 
                key={i} 
                className={cn(
                  colorClass.split(" ")[0],
                  "rounded-sm animate-[height_1s_ease-in-out_infinite]", 
                  barSizes[size]
                )} 
                style={{
                  animationDelay: `${i * 0.15}s`,
                  height: "60%"
                }}
              />
            ))}
          </div>
        );
      case "sparkles":
        return (
          <div className="relative">
            <Sparkles 
              className={cn(
                "animate-pulse text-primary",
                size === "sm" ? "h-8 w-8" : size === "md" ? "h-12 w-12" : "h-16 w-16"
              )} 
            />
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse filter blur-md -z-10"></div>
          </div>
        );
      default:
        return (
          <Loader2 
            className={cn(
              "animate-spin text-primary",
              size === "sm" ? "h-8 w-8" : size === "md" ? "h-12 w-12" : "h-16 w-16"
            )} 
          />
        );
    }
  };
  
  return (
    <div className={cn("flex flex-col items-center", className)}>
      {renderLoader()}
      {text && (
        <p className={cn(
          "mt-4 text-sm text-muted-foreground", 
          variant === "sparkles" && "animate-pulse", 
          textClassName
        )}>
          {text}
        </p>
      )}
    </div>
  );
}
