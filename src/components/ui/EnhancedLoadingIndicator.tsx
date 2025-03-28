
import React from "react";
import { Loader2, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface EnhancedLoadingIndicatorProps {
  size?: number;
  className?: string;
  text?: string;
  variant?: "spinner" | "progress" | "dots" | "pulse";
  showProgress?: boolean;
  progress?: number;
}

export function EnhancedLoadingIndicator({
  size = 24,
  className = "",
  text = "Loading...",
  variant = "spinner",
  showProgress = false,
  progress = 0,
}: EnhancedLoadingIndicatorProps) {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      {variant === "spinner" && (
        <Loader2
          className={cn("animate-spin text-primary", className)}
          size={size}
        />
      )}

      {variant === "progress" && (
        <div className="w-full max-w-xs space-y-2">
          <LoaderCircle
            className={cn("animate-spin text-primary mx-auto", className)}
            size={size}
          />
          {showProgress && (
            <Progress value={progress} className="h-2 w-full" />
          )}
        </div>
      )}

      {variant === "dots" && (
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "h-3 w-3 rounded-full bg-primary animate-pulse",
                `animation-delay-${i * 200}`,
                className
              )}
              style={{
                animationDelay: `${i * 200}ms`,
              }}
            />
          ))}
        </div>
      )}

      {variant === "pulse" && (
        <div
          className={cn(
            "h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin",
            className
          )}
        />
      )}

      {text && (
        <p className="mt-3 text-sm text-muted-foreground font-medium">{text}</p>
      )}
    </div>
  );
}

// Add animation delay utility for sequenced animations
const styles = document.createElement("style");
styles.innerHTML = `
  .animation-delay-200 {
    animation-delay: 200ms;
  }
  .animation-delay-400 {
    animation-delay: 400ms;
  }
`;
document.head.appendChild(styles);
