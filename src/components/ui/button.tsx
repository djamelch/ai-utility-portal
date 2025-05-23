
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:transition-all [&_svg]:duration-300",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md hover:shadow-primary/20 hover:-translate-y-0.5 dark:hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-md hover:shadow-destructive/20 hover:-translate-y-0.5",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:shadow-sm hover:-translate-y-0.5 dark:border-border/30 dark:hover:bg-accent/30",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-sm hover:-translate-y-0.5 dark:bg-secondary/30 dark:text-secondary-foreground dark:hover:bg-secondary/40",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:shadow-sm",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/90",
        gradient: "bg-gradient-to-r from-primary to-primary-600 text-primary-foreground hover:shadow-md hover:shadow-primary/20 hover:-translate-y-0.5 hover:opacity-90",
        active: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md hover:shadow-primary/20 hover:-translate-y-0.5",
        success: "bg-green-500 text-white hover:bg-green-600 hover:shadow-md hover:shadow-green-500/20 hover:-translate-y-0.5",
        warning: "bg-amber-500 text-black hover:bg-amber-600 hover:shadow-md hover:shadow-amber-500/20 hover:-translate-y-0.5 dark:text-black",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90 hover:shadow-md hover:shadow-accent/20 hover:-translate-y-0.5",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-md px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
