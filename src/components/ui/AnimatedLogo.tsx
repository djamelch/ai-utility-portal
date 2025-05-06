
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface AnimatedLogoProps {
  text: string;
  className?: string;
  icon?: React.ReactNode;
  glowEffect?: boolean;
  pulseEffect?: boolean;
  textGradient?: boolean;
}

export function AnimatedLogo({
  text,
  className,
  icon,
  glowEffect = true,
  pulseEffect = true,
  textGradient = true
}: AnimatedLogoProps) {
  return (
    <div 
      className={cn(
        "flex items-center gap-2 relative",
        glowEffect && "after:absolute after:inset-0 after:opacity-20 after:blur-xl after:bg-primary after:rounded-full after:-z-10",
        pulseEffect && "animate-scale-pulse",
        className
      )}
    >
      {icon || <Sparkles size={24} className="text-primary animate-logo-glow" />}
      <span 
        className={cn(
          "font-display font-bold text-lg md:text-xl",
          textGradient && "text-gradient"
        )}
      >
        {text}
      </span>
    </div>
  );
}
