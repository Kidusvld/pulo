
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "./loading-spinner";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-saas-brand-primary to-saas-brand-secondary text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 rounded-2xl",
        destructive: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 rounded-2xl",
        outline: "border border-saas-border bg-white text-saas-text-primary hover:bg-gray-50 hover:shadow-md rounded-2xl",
        secondary: "bg-gray-100 text-saas-text-primary hover:bg-gray-200 rounded-2xl",
        ghost: "text-saas-text-primary hover:bg-gray-100 rounded-2xl",
        link: "text-saas-brand-primary underline-offset-4 hover:underline",
        success: "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 rounded-2xl",
        warning: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 rounded-2xl",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 rounded-xl px-4 py-2 text-xs",
        lg: "h-12 rounded-2xl px-8 py-4 text-base",
        xl: "h-14 rounded-2xl px-10 py-5 text-lg",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface SaaSButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const SaaSButton = React.forwardRef<HTMLButtonElement, SaaSButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <LoadingSpinner size="sm" className="text-current" />}
        {children}
      </Comp>
    );
  }
);
SaaSButton.displayName = "SaaSButton";

export { SaaSButton, buttonVariants };
