import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  [
    "flex w-full rounded-lg border bg-background text-base ring-offset-background transition-colors",
    "file:border-0 file:bg-transparent file:text-sm file:font-medium",
    "placeholder:text-muted-foreground/60 placeholder-shown:truncate",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "aria-invalid:border-destructive aria-invalid:ring-destructive/50"
  ].join(' '),
  {
    variants: {
      variant: {
        default: "border-input hover:border-primary/50 focus:border-primary/50",
        outline: "border border-border bg-transparent hover:border-primary/50",
        filled: "border-transparent bg-muted hover:bg-muted/80 focus:bg-background",
        flushed: "border-b border-input bg-transparent rounded-none px-0 focus:border-primary focus:ring-0 focus:ring-offset-0",
        unstyled: "border-0 bg-transparent px-0 focus:ring-0 focus:ring-offset-0",
      },
      size: {
        sm: "h-8 px-2.5 py-1.5 text-sm",
        md: "h-10 px-3 py-2 text-sm",
        lg: "h-11 px-4 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  htmlSize?: number
  isInvalid?: boolean
  errorMessage?: string
  label?: string
  description?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    type = 'text',
    variant,
    size,
    htmlSize,
    id,
    isInvalid,
    errorMessage,
    label,
    description,
    'aria-describedby': ariaDescribedBy,
    'aria-errormessage': ariaErrorMessage,
    ...props
  }, ref) => {
    const generatedId = React.useId()
    const inputId = id || generatedId
    const errorId = `${inputId}-error`
    const descriptionId = `${inputId}-description`
    const hasError = isInvalid || !!errorMessage
    
    const input = (
      <input
        type={type}
        id={inputId}
        className={cn(
          inputVariants({ variant, size }),
          hasError && 'border-destructive focus-visible:ring-destructive/50',
          className
        )}
        ref={ref}
        size={htmlSize}
        aria-invalid={hasError}
        aria-describedby={
          [
            description ? descriptionId : undefined,
            hasError ? errorId : undefined,
            ariaDescribedBy
          ]
            .filter(Boolean)
            .join(' ') || undefined
        }
        {...props}
      />
    )

    if (!label && !description && !errorMessage) {
      return input
    }

    return (
      <div className="grid w-full gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        {input}
        {description && !hasError && (
          <p id={descriptionId} className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
        {errorMessage && (
          <p id={errorId} className="text-sm font-medium text-destructive">
            {errorMessage}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
