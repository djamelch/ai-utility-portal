
import { cn } from "@/lib/utils";
import { MotionWrapper } from "./MotionWrapper";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  animation?: "fadeIn" | "slideUp" | "slideDown" | "slideInRight" | "scaleIn" | "none";
  index?: number;
  hoverEffect?: boolean;
  glowEffect?: boolean;
  glowColor?: string;
  showBadge?: boolean;
  badgeText?: string;
}

export function FeatureCard({
  title,
  description,
  icon,
  className,
  iconClassName,
  titleClassName,
  descriptionClassName,
  animation = "fadeIn",
  index = 0,
  hoverEffect = true,
  glowEffect = false,
  glowColor = "before:from-primary/40 before:to-primary/20", // Simplified colors
  showBadge = false,
  badgeText = "Featured"
}: FeatureCardProps) {
  // Convert the index to one of the supported delay values
  const getDelay = (index: number) => {
    const delayMap: Record<number, "delay-100" | "delay-200" | "delay-300" | "delay-400" | "delay-500" | "none"> = {
      0: "delay-100",
      1: "delay-200",
      2: "delay-300",
      3: "delay-400",
      4: "delay-500"
    };
    
    return delayMap[index % 5] || "none";
  };
  
  return (
    <MotionWrapper 
      animation={animation} 
      delay={getDelay(index)}
    >
      <div 
        className={cn(
          "relative rounded-xl p-6 transition-all duration-300",
          "bg-background/40 dark:bg-gradient-to-br dark:from-card/70 dark:to-card/40 backdrop-blur-md",
          "border border-border/30",
          "shadow-sm",
          hoverEffect && "hover:border-primary/20 hover:shadow-md hover:-translate-y-1", // Simplified color
          glowEffect && "before:absolute before:inset-0 before:opacity-0 before:rounded-xl before:transition-opacity before:duration-500 hover:before:opacity-100 before:bg-gradient-to-br before:-z-10 before:blur-xl before:scale-150",
          glowColor,
          className
        )}
      >
        {/* Glass-like highlight effects */}
        <div className="absolute top-0 left-0 right-0 h-px bg-white/20 dark:bg-white/10" />
        <div className="absolute top-0 left-0 bottom-0 w-px bg-white/20 dark:bg-white/10 opacity-50" />
        
        {showBadge && (
          <div className="absolute -top-2 -right-2 bg-primary text-white text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
            {badgeText}
          </div>
        )}
        
        <div className={cn("flex flex-col space-y-4")}>
          <div 
            className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center",
              "bg-primary/10 text-primary shadow-sm", // Simplified colors
              "relative overflow-hidden group",
              iconClassName
            )}
          >
            {/* Icon glow effect */}
            <div className="absolute inset-0 bg-primary/30 opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
            <div className="relative z-10 scale-100 group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
          </div>
          
          <h3 
            className={cn(
              "text-xl font-semibold tracking-tight",
              titleClassName
            )}
          >
            {title}
          </h3>
          
          <p 
            className={cn(
              "text-muted-foreground",
              descriptionClassName
            )}
          >
            {description}
          </p>
        </div>
      </div>
    </MotionWrapper>
  );
}
