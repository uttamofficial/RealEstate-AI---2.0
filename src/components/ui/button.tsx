import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary/50",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/50",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-secondary/50",
        ghost: "hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/50",
        link: "text-primary underline-offset-4 hover:underline focus-visible:ring-ring/50 focus-visible:rounded focus-visible:ring-2",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
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
  'aria-label'?: string
  'aria-expanded'?: boolean
  'aria-haspopup'?: boolean | 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid'
  'aria-controls'?: string
  'aria-pressed'?: boolean | 'mixed'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    type = 'button',
    'aria-label': ariaLabel,
    children,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    const isIconOnly = React.Children.toArray(children).every(
      (child) => React.isValidElement(child) && child.type !== 'span' && child.type !== 'p'
    )
    
    // Auto-generate aria-label if not provided and button is icon-only
    const buttonAriaLabel = ariaLabel || (isIconOnly && typeof children === 'object' ? 'Button' : undefined)
    
    return (
      <Comp
        type={type}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        aria-label={buttonAriaLabel}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
