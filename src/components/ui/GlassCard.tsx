
import { cn } from "@/lib/utils";
import { MotionWrapper } from "./MotionWrapper";
import { ReactNode } from "react";

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
  glowEffect?: boolean;
  glowColor?: string;
  badge?: ReactNode;
  onClick?: () => void;
  pulseBorder?: boolean;
}

export function GlassCard({ 
  children, 
  className,
  animation = "fadeIn",
  hoverEffect = true,
  glowEffect = false,
  glowColor = "before:from-primary/40 before:to-accent/40",
  badge,
  onClick,
  pulseBorder = false
}: GlassCardProps) {
  return (
    <MotionWrapper animation={animation}>
      <div 
        className={cn(
          "rounded-xl backdrop-blur-sm bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 p-6 relative overflow-hidden",
          "shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
          hoverEffect && "transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1",
          glowEffect && "before:absolute before:inset-0 before:opacity-0 before:rounded-xl before:transition-opacity before:duration-500 hover:before:opacity-100 before:bg-gradient-to-br before:-z-10 before:blur-xl before:scale-150",
          pulseBorder && "border-primary/30 animate-[pulse_3s_ease-in-out_infinite]",
          glowColor,
          onClick && "cursor-pointer",
          className
        )}
        onClick={onClick}
      >
        {badge && (
          <div className="absolute -top-1 -right-1 z-10">
            {badge}
          </div>
        )}
        {children}
      </div>
    </MotionWrapper>
  );
}
