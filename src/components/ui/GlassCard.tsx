
import { cn } from "@/lib/utils";
import { MotionWrapper } from "./MotionWrapper";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  animation?: 
    | "fadeIn" 
    | "slideUp" 
    | "slideDown" 
    | "slideInRight" 
    | "scaleIn"
    | "none";
  hoverEffect?: boolean;
}

export function GlassCard({ 
  children, 
  className,
  animation = "fadeIn",
  hoverEffect = true
}: GlassCardProps) {
  return (
    <MotionWrapper animation={animation}>
      <div 
        className={cn(
          "rounded-xl backdrop-blur-sm bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 p-6",
          "shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
          hoverEffect && "transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1",
          className
        )}
      >
        {children}
      </div>
    </MotionWrapper>
  );
}
