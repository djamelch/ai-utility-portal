
import { cn } from "@/lib/utils";
import { MotionWrapper } from "./MotionWrapper";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  return (
    <MotionWrapper animation="fadeIn">
      <div className={cn("flex flex-col items-center justify-center", className)}>
        <div
          className={cn(
            "animate-spin rounded-full border-solid border-primary border-t-transparent",
            sizeClasses[size]
          )}
        />
      </div>
    </MotionWrapper>
  );
}
