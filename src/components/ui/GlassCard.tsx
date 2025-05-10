
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
  glowColor = "before:from-primary/20 before:to-primary/5", // Softer glow
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
          variant === 'default' && "bg-background/80 dark:bg-background/50 border border-white/5 dark:border-white/3",
          variant === 'featured' && "bg-background/90 dark:bg-background/60 border border-primary/10 dark:border-primary/5", 
          variant === 'elevated' && "bg-background/95 dark:bg-background/70 border border-white/10 dark:border-white/5 shadow-lg",
          "shadow-[0_4px_20px_rgb(0,0,0,0.03)]",
          hoverEffect && "hover:shadow-[0_8px_25px_rgb(0,0,0,0.05)] hover:-translate-y-1",
          glowEffect && "before:absolute before:inset-0 before:opacity-0 before:rounded-xl before:transition-opacity before:duration-500 hover:before:opacity-100 before:bg-gradient-to-br before:-z-10 before:blur-xl before:scale-125",
          pulseBorder && "border-primary/10 animate-[pulse_3s_ease-in-out_infinite]", 
          glowColor,
          onClick && "cursor-pointer",
          "p-6",
          className
        )}
        onClick={onClick}
      >
        {/* Subtle glass highlight effects */}
        <div className="absolute top-0 left-0 right-0 h-px bg-white/5"></div>
        <div className="absolute top-0 left-0 bottom-0 w-px bg-white/5 opacity-20"></div>
        
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
