"use client";

/**
 * components/ui/card.tsx
 *
 * Reusable Card primitive system following Vayam paper card design.
 * Composable sub-components: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter.
 */

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

export type CardVariant =
  | "default"
  | "interactive"
  | "selected"
  | "highlighted"
  | "muted"
  | "milestone";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variantClass = {
      default: "card-base",
      interactive: "card-interactive",
      selected: "card-selected",
      highlighted: "card-highlighted",
      muted: "card-base bg-muted border-border-subtle",
      milestone: "card-milestone",
    }[variant];

    return (
      <div ref={ref} className={cn(variantClass, className)} {...props}>
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export const CardHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1.5 mb-4", className)}
    {...props}
  >
    {children}
  </div>
));
CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-h3 font-bold text-foreground", className)}
    {...props}
  >
    {children}
  </h3>
));
CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-body-sm text-muted-foreground", className)}
    {...props}
  >
    {children}
  </p>
));
CardDescription.displayName = "CardDescription";

export const CardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-4", className)} {...props}>
    {children}
  </div>
));
CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mt-6 pt-4 border-t border-border-subtle flex items-center justify-between gap-4",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
CardFooter.displayName = "CardFooter";
