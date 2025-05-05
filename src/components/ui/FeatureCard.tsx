
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
  index = 0
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
          "rounded-xl p-6 transition-all duration-300 bg-background/40 hover:bg-background/70 border border-border/30 hover:border-primary/20 shadow-sm hover:shadow-md hover:-translate-y-1",
          className
        )}
      >
        <div className={cn("flex flex-col space-y-4")}>
          <div 
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center bg-primary/10 text-primary",
              iconClassName
            )}
          >
            {icon}
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
              "text-muted-foreground text-sm",
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
