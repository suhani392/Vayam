"use client";

/**
 * components/ui/dropdown.tsx
 *
 * Accessible Dropdown / Menu popover system for Vayam.
 * Used for language selectors, profile menus, sorting, filtering, and row actions.
 */

import React, { useState, useRef, useEffect, useId } from "react";
import { cn } from "@/lib/utils/cn";

export interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}

export function Dropdown({
  trigger,
  children,
  align = "left",
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  // Close on outside click or ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <div
        role="button"
        tabIndex={0}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className="inline-flex cursor-pointer"
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          id={menuId}
          role="menu"
          tabIndex={-1}
          className={cn(
            "absolute z-50 mt-2 w-56 rounded-xl bg-card border border-border-subtle shadow-md p-1.5 focus:outline-none animate-in fade-in duration-150",
            align === "right" ? "right-0" : "left-0",
            className
          )}
        >
          <div onClick={() => setIsOpen(false)}>{children}</div>
        </div>
      )}
    </div>
  );
}

export interface DropdownItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  selected?: boolean;
}

export function DropdownItem({
  icon,
  selected = false,
  className,
  children,
  ...props
}: DropdownItemProps) {
  return (
    <button
      role="menuitem"
      type="button"
      className={cn(
        "w-full flex items-center gap-2.5 px-3 py-2 text-body-sm font-medium rounded-lg text-left transition-colors cursor-pointer select-none",
        selected
          ? "bg-primary-subtle text-primary font-semibold"
          : "text-foreground hover:bg-muted",
        className
      )}
      {...props}
    >
      {icon && <span className="text-muted-foreground flex-shrink-0">{icon}</span>}
      <span className="flex-1 truncate">{children}</span>
    </button>
  );
}
