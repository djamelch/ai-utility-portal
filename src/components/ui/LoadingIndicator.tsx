
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingIndicatorProps {
  size?: number;
  className?: string;
  text?: string;
}

export function LoadingIndicator({ 
  size = 24, 
  className = "", 
  text = "Loading..." 
}: LoadingIndicatorProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <Loader2 
        className={cn("animate-spin text-primary", className)} 
        size={size} 
      />
      {text && (
        <p className="mt-2 text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  );
}
