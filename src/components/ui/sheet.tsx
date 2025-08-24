"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Sheet = SheetPrimitive.Root
const SheetTrigger = SheetPrimitive.Trigger
const SheetClose = SheetPrimitive.Close
const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-all duration-100",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition-all duration-200 ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        top: [
          "inset-x-0 top-0 border-b",
          "data-[state=closed]:duration-200 data-[state=open]:duration-300",
          "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        ],
        bottom: [
          "inset-x-0 bottom-0 border-t",
          "data-[state=closed]:duration-200 data-[state=open]:duration-300",
          "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        ],
        left: [
          "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          "data-[state=closed]:duration-300 data-[state=open]:duration-400",
          "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
        ],
        right: [
          "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          "data-[state=closed]:duration-300 data-[state=open]:duration-400",
          "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
        ],
      },
      variant: {
        default: "bg-background text-foreground",
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        accent: "bg-accent text-accent-foreground",
        transparent: "bg-transparent text-foreground",
      },
      size: {
        default: "p-6",
        sm: "p-4",
        lg: "p-8",
        none: "p-0",
      },
      rounded: {
        default: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-2xl",
      },
    },
    defaultVariants: {
      side: "right",
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
)

type SheetContentProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & {
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  side?: 'top' | 'right' | 'bottom' | 'left'
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'transparent'
  size?: 'default' | 'sm' | 'lg' | 'none'
  rounded?: 'default' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(
  (
    {
      side = "right",
      variant = "default",
      size = "default",
      rounded = "default",
      className,
      children,
      showCloseButton = true,
      closeOnOverlayClick = true,
      onPointerDownOutside,
      ...props
    },
    ref
  ) => (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        ref={ref}
        className={cn(sheetVariants({ side, variant, size, rounded }), className)}
        onPointerDownOutside={(e) => {
          if (!closeOnOverlayClick) {
            e.preventDefault()
          }
          onPointerDownOutside?.(e)
        }}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close
            className={cn(
              "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity",
              "hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "disabled:pointer-events-none data-[state=open]:bg-secondary",
              variant === "primary" && "text-primary-foreground/80 hover:text-primary-foreground",
              variant === "secondary" && "text-secondary-foreground/80 hover:text-secondary-foreground",
              variant === "accent" && "text-accent-foreground/80 hover:text-accent-foreground"
            )}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  )
)
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 sm:space-y-0",
      "mt-6",
      className
    )}
    {...props}
  />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

const SheetBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex-1 overflow-y-auto py-4", className)}
    {...props}
  />
)
SheetBody.displayName = "SheetBody"

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetBody,
}
