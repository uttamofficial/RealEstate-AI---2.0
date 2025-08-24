"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const sliderVariants = cva(
  "relative flex w-full touch-none select-none items-center",
  {
    variants: {
      variant: {
        default: "",
        range: "",
        primary: "",
        secondary: "",
      },
      size: {
        sm: "h-1",
        md: "h-2",
        lg: "h-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

const trackVariants = cva(
  "relative w-full grow overflow-hidden rounded-full",
  {
    variants: {
      variant: {
        default: "bg-secondary",
        range: "bg-secondary/50",
        primary: "bg-primary/20",
        secondary: "bg-secondary/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const rangeVariants = cva("absolute h-full", {
  variants: {
    variant: {
      default: "bg-primary",
      range: "bg-primary",
      primary: "bg-primary",
      secondary: "bg-secondary",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const thumbVariants = cva(
  "block rounded-full border-2 bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-primary",
        range: "border-primary",
        primary: "border-primary bg-primary text-primary-foreground",
        secondary: "border-secondary bg-secondary text-secondary-foreground",
      },
      size: {
        sm: "h-3.5 w-3.5",
        md: "h-4 w-4",
        lg: "h-5 w-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
    VariantProps<typeof sliderVariants> {}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, variant, size, onValueChange, value, defaultValue, ...props }, ref) => {
  // Stable ref to avoid infinite re-renders
  const stableRef = React.useRef<React.ElementRef<typeof SliderPrimitive.Root>>(null);
  
  // Combine the forwarded ref with our stable ref
  React.useImperativeHandle(ref, () => stableRef.current!);

  // Memoize the thumb count to prevent unnecessary re-renders
  const thumbCount = React.useMemo(() => {
    const currentValue = value || defaultValue || [0];
    return Array.isArray(currentValue) ? currentValue.length : 1;
  }, [value, defaultValue]);

  // Create a stable onValueChange handler
  const handleValueChange = React.useCallback((newValue: number[]) => {
    onValueChange?.(newValue);
  }, [onValueChange]);

  return (
    <SliderPrimitive.Root
      ref={stableRef}
      className={cn(sliderVariants({ variant, size, className }))}
      onValueChange={handleValueChange}
      value={value}
      defaultValue={defaultValue}
      {...props}
    >
      <SliderPrimitive.Track className={trackVariants({ variant })}>
        <SliderPrimitive.Range className={rangeVariants({ variant })} />
      </SliderPrimitive.Track>
      {Array.from({ length: thumbCount }, (_, index) => (
        <SliderPrimitive.Thumb 
          key={`thumb-${index}`}
          className={thumbVariants({ variant, size })} 
        />
      ))}
    </SliderPrimitive.Root>
  )
})

Slider.displayName = "Slider"

export { Slider, sliderVariants }
