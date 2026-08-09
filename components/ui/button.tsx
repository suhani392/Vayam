"use client";

/**
 * components/ui/button.tsx
 *
 * Reusable, accessible, theme-aware Button primitive.
 * Supports primary, secondary, outline, ghost, destructive, accent, icon variants.
 */

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";
import { Loader2 } from "lucide-react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "accent";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const variantClass = {
      primary: "btn-primary",
      secondary: "btn-secondary",
      outline: "btn-outline",
      ghost: "btn-ghost",
      destructive: "btn-destructive",
      accent: "btn-accent",
    }[variant];

    const sizeClass = {
      sm: "btn-sm",
      md: "",
      lg: "btn-lg",
    }[size];

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          "btn",
          variantClass,
          sizeClass,
          fullWidth && "w-full",
          isLoading && "cursor-wait opacity-80",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

/* Convenience Variant Exports */

export const PrimaryButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => <Button ref={ref} variant="primary" {...props} />
);
PrimaryButton.displayName = "PrimaryButton";

export const SecondaryButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => <Button ref={ref} variant="secondary" {...props} />
);
SecondaryButton.displayName = "SecondaryButton";

export const OutlineButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => <Button ref={ref} variant="outline" {...props} />
);
OutlineButton.displayName = "OutlineButton";

export const GhostButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => <Button ref={ref} variant="ghost" {...props} />
);
GhostButton.displayName = "GhostButton";

export const DestructiveButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => <Button ref={ref} variant="destructive" {...props} />
);
DestructiveButton.displayName = "DestructiveButton";

export interface IconButtonProps extends ButtonProps {
  "aria-label": string;
  icon: React.ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, className, size = "md", ...props }, ref) => {
    const iconSizeClass = {
      sm: "h-8 w-8 p-0 rounded-lg",
      md: "h-9 w-9 p-0 rounded-lg",
      lg: "h-11 w-11 p-0 rounded-xl",
    }[size];

    return (
      <Button
        ref={ref}
        size={size}
        className={cn("justify-center", iconSizeClass, className)}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);
IconButton.displayName = "IconButton";
