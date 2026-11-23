import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary-container text-on-primary-container hover:bg-primary shadow-sm",
        secondary:
          "bg-surface-container-high text-on-surface hover:bg-surface-container-highest",
        outline:
          "border border-outline-variant bg-transparent text-on-surface hover:bg-surface-container-high",
        ghost:
          "bg-transparent text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
        destructive:
          "bg-error/15 text-error hover:bg-error/25 border border-error/30",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
