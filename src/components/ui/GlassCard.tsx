
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
  variant?: 'default' | 'featured' | 'elevated';
}

export function GlassCard({ 
  children, 
  className,
  animation = "fadeIn",
  hoverEffect = true,
  glowEffect = false,
  glowColor = "before:from-[#0DB6E4]/40 before:to-[#FF7857]/40", // Updated colors
  badge,
  onClick,
  pulseBorder = false,
  variant = 'default'
}: GlassCardProps) {
  return (
    <MotionWrapper animation={animation}>
      <div 
        className={cn(
          "rounded-xl backdrop-blur-sm relative overflow-hidden transition-all duration-300",
          variant === 'default' && "bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10",
          variant === 'featured' && "bg-white/15 dark:bg-black/25 border-2 border-[#0DB6E4]/50 dark:border-[#0DB6E4]/30", // Updated from amber to cyan
          variant === 'elevated' && "bg-white/20 dark:bg-black/30 border border-white/30 dark:border-white/15 shadow-xl",
          "shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
          hoverEffect && "hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1",
          glowEffect && "before:absolute before:inset-0 before:opacity-0 before:rounded-xl before:transition-opacity before:duration-500 hover:before:opacity-100 before:bg-gradient-to-br before:-z-10 before:blur-xl before:scale-150",
          pulseBorder && "border-[#0DB6E4]/30 animate-[pulse_3s_ease-in-out_infinite]", // Updated border color
          glowColor,
          onClick && "cursor-pointer",
          "p-6", // Added default padding
          className
        )}
        onClick={onClick}
      >
        {/* Glass-like highlight effects */}
        <div className="absolute top-0 left-0 right-0 h-px bg-white/20 dark:bg-white/10" />
        <div className="absolute top-0 left-0 bottom-0 w-px bg-white/20 dark:bg-white/10 opacity-50" />
        
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
