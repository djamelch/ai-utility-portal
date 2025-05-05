
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { ButtonProps } from "./button";
import { ReactNode } from "react";

interface AnimatedButtonProps extends ButtonProps {
  children: ReactNode;
  glowEffect?: boolean;
  rippleEffect?: boolean;
  iconFloat?: boolean;
  gradientBorder?: boolean;
}

export function AnimatedButton({
  children,
  className,
  glowEffect = false,
  rippleEffect = false,
  iconFloat = false,
  gradientBorder = false,
  ...props
}: AnimatedButtonProps) {
  return (
    <Button
      className={cn(
        "relative overflow-hidden group",
        glowEffect && "after:absolute after:inset-0 after:opacity-0 after:transition-opacity after:duration-300 hover:after:opacity-100 after:blur-xl after:bg-gradient-to-r after:from-primary/40 after:to-accent/40 after:-z-10",
        rippleEffect && "active:before:absolute active:before:top-1/2 active:before:left-1/2 active:before:-translate-x-1/2 active:before:-translate-y-1/2 active:before:h-10 active:before:w-10 active:before:rounded-full active:before:bg-primary/20 active:before:animate-ripple active:before:z-10",
        gradientBorder && "border-2 border-transparent bg-clip-padding before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-gradient-to-r before:from-primary before:to-accent",
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {iconFloat ? (
          <>
            {Array.isArray(children) ? (
              <>
                {children[0] && (
                  <span className="group-hover:animate-float transition-transform duration-300">
                    {children[0]}
                  </span>
                )}
                {children.slice(1)}
              </>
            ) : (
              children
            )}
          </>
        ) : (
          children
        )}
      </span>
    </Button>
  );
}
