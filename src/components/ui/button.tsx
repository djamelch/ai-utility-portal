
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:transition-all [&_svg]:duration-300",
  {
    variants: {
      variant: {
        default: "bg-hostinger-brand text-white hover:bg-hostinger-brand/90 hover:shadow-md hover:shadow-hostinger-brand/20 hover:-translate-y-0.5 dark:bg-hostinger-brand/90 dark:hover:bg-hostinger-brand",
        destructive:
          "bg-hostinger-error text-white hover:bg-hostinger-error/90 hover:shadow-md hover:shadow-hostinger-error/20 hover:-translate-y-0.5 dark:bg-hostinger-error/90 dark:hover:bg-hostinger-error",
        outline:
          "border border-input bg-background hover:bg-hostinger-accent/10 hover:text-hostinger-accent hover:border-hostinger-accent hover:shadow-sm hover:-translate-y-0.5 dark:border-hostinger-accent/30 dark:hover:bg-hostinger-accent/20",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-sm hover:-translate-y-0.5 dark:bg-secondary/30 dark:text-secondary-foreground dark:hover:bg-secondary/40",
        ghost: "hover:bg-hostinger-accent/10 hover:text-hostinger-accent hover:shadow-sm dark:hover:bg-hostinger-accent/20",
        link: "text-hostinger-link underline-offset-4 hover:underline hover:text-hostinger-link/90 dark:text-hostinger-accent dark:hover:text-hostinger-accent/80",
        gradient: "bg-gradient-to-r from-hostinger-brand to-hostinger-accent text-white hover:shadow-md hover:shadow-hostinger-brand/20 hover:-translate-y-0.5 hover:opacity-90 dark:from-hostinger-brand/90 dark:to-hostinger-accent/90 dark:hover:from-hostinger-brand dark:hover:to-hostinger-accent",
        active: "bg-hostinger-active text-white hover:bg-hostinger-active/90 hover:shadow-md hover:shadow-hostinger-active/20 hover:-translate-y-0.5 dark:bg-hostinger-active/90 dark:hover:bg-hostinger-active",
        success: "bg-hostinger-success text-white hover:bg-hostinger-successHover hover:shadow-md hover:shadow-hostinger-success/20 hover:-translate-y-0.5 dark:bg-hostinger-success/90 dark:hover:bg-hostinger-success",
        warning: "bg-hostinger-warning text-black hover:bg-hostinger-warning/90 hover:shadow-md hover:shadow-hostinger-warning/20 hover:-translate-y-0.5 dark:text-black dark:bg-hostinger-warning/90 dark:hover:bg-hostinger-warning",
        international: "bg-hostinger-international text-white hover:bg-hostinger-international/90 hover:shadow-md hover:shadow-hostinger-international/20 hover:-translate-y-0.5 dark:bg-hostinger-international/90 dark:hover:bg-hostinger-international",
        accent: "bg-hostinger-accent text-white hover:bg-hostinger-accent/90 hover:shadow-md hover:shadow-hostinger-accent/20 hover:-translate-y-0.5 dark:bg-hostinger-accent/90 dark:hover:bg-hostinger-accent",
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
