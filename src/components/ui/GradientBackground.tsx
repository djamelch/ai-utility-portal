
import { cn } from "@/lib/utils";

interface GradientBackgroundProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "accent" | "subtle";
}

export function GradientBackground({ 
  children, 
  className,
  variant = "primary"
}: GradientBackgroundProps) {
  const gradientStyles = {
    primary: "bg-gradient-to-br from-primary/5 via-accent/5 to-transparent",
    secondary: "bg-gradient-to-tr from-primary/5 via-background to-accent/5",
    accent: "bg-gradient-to-b from-accent/10 to-transparent",
    subtle: "bg-gradient-to-br from-secondary/80 via-background to-secondary/50"
  };
  
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className={cn("absolute inset-0", gradientStyles[variant])} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
