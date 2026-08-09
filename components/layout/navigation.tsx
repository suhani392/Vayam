"use client";

/**
 * components/layout/navigation.tsx
 *
 * Navigation building blocks for Vayam:
 * NavItem, NavSection, Breadcrumb, PageHeader, SectionHeader.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface NavItemProps {
  href: string;
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  badge?: React.ReactNode;
  className?: string;
}

export function NavItem({
  href,
  label,
  icon,
  active = false,
  badge,
  className,
}: NavItemProps) {
  return (
    <Link
      href={href as any}
      className={cn(
        "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-nav font-medium transition-all duration-150 group",
        active
          ? "bg-accent-subtle text-accent font-bold shadow-2xs"
          : "text-muted-foreground hover:text-foreground hover:bg-muted",
        className
      )}
    >
      {icon && (
        <span
          className={cn(
            "flex-shrink-0 transition-colors",
            active ? "text-accent" : "text-muted-foreground group-hover:text-foreground"
          )}
        >
          {icon}
        </span>
      )}
      <span className="flex-1 truncate">{label}</span>
      {badge && <span className="flex-shrink-0">{badge}</span>}
    </Link>
  );
}

export interface NavSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function NavSection({ title, children, className }: NavSectionProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {title && (
        <p className="px-3.5 text-caption font-bold text-muted-foreground uppercase tracking-widest">
          {title}
        </p>
      )}
      <nav className="space-y-1">{children}</nav>
    </div>
  );
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-caption">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight size={12} className="text-muted-foreground" />
            )}
            {isLast || !item.href ? (
              <span className="font-bold text-foreground">{item.label}</span>
            ) : (
              <Link
                href={item.href as any}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  badge,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle", className)}>
      <div className="space-y-1 max-w-3xl">
        {badge && <div className="mb-2">{badge}</div>}
        <h1 className="text-h1 font-bold text-foreground">{title}</h1>
        {description && (
          <p className="text-body-lg text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3 flex-shrink-0">{actions}</div>}
    </div>
  );
}

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-end justify-between gap-4 mb-6", className)}>
      <div>
        <h2 className="text-h2 font-bold text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-body-sm text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
