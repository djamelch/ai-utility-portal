
import { cn } from "@/lib/utils";

interface ModernLoadingIndicatorProps {
  size?: "sm" | "md" | "lg";
  variant?: "dots" | "spinner" | "pulse" | "bars";
  className?: string;
  textClassName?: string;
  text?: string;
}

export function ModernLoadingIndicator({
  size = "md",
  variant = "dots", 
  className,
  textClassName,
  text
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
  
  const renderLoader = () => {
    switch (variant) {
      case "dots":
        return (
          <div className="flex justify-center items-center gap-2">
            {[0, 1, 2].map((i) => (
              <div 
                key={i} 
                className={cn(
                  "rounded-full bg-primary/80 animate-bounce", 
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
          <div
            className={cn(
              "rounded-full border-2 md:border-3 lg:border-4 border-primary/30 border-t-primary animate-spin",
              sizeClasses[size]
            )}
          />
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
                  "bg-primary/80 rounded-sm animate-[height_1s_ease-in-out_infinite]", 
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
      default:
        return null;
    }
  };
  
  return (
    <div className={cn("flex flex-col items-center", className)}>
      {renderLoader()}
      {text && (
        <p className={cn("mt-4 text-sm text-muted-foreground", textClassName)}>
          {text}
        </p>
      )}
    </div>
  );
}
