"use client";

/**
 * components/ui/tabs.tsx
 *
 * Keyboard-accessible Tabs component system for Vayam.
 * Includes Tabs, TabList, Tab, TabPanel.
 */

import React, { createContext, useContext, useState, useId } from "react";
import { cn } from "@/lib/utils/cn";

interface TabsContextValue {
  selectedTab: string;
  setSelectedTab: (id: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tab components must be used within <Tabs>");
  return ctx;
}

export interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const baseId = useId();

  const selectedTab = value !== undefined ? value : internalValue;

  const setSelectedTab = (id: string) => {
    if (value === undefined) setInternalValue(id);
    onValueChange?.(id);
  };

  return (
    <TabsContext.Provider value={{ selectedTab, setSelectedTab, baseId }}>
      <div className={cn("w-full space-y-4", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export interface TabListProps extends React.HTMLAttributes<HTMLDivElement> {
  ariaLabel?: string;
}

export function TabList({ className, children, ariaLabel, ...props }: TabListProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "flex items-center gap-1.5 p-1 bg-surface-secondary border border-border-subtle rounded-xl overflow-x-auto",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface TabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export function Tab({ value, className, children, ...props }: TabProps) {
  const { selectedTab, setSelectedTab, baseId } = useTabsContext();
  const isSelected = selectedTab === value;
  const tabId = `${baseId}-tab-${value}`;
  const panelId = `${baseId}-panel-${value}`;

  return (
    <button
      role="tab"
      id={tabId}
      aria-selected={isSelected}
      aria-controls={panelId}
      tabIndex={isSelected ? 0 : -1}
      type="button"
      onClick={() => setSelectedTab(value)}
      className={cn(
        "flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-button font-medium transition-all duration-150 whitespace-nowrap cursor-pointer select-none",
        isSelected
          ? "bg-card text-foreground shadow-sm font-semibold"
          : "text-muted-foreground hover:text-foreground hover:bg-card/50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function TabPanel({ value, className, children, ...props }: TabPanelProps) {
  const { selectedTab, baseId } = useTabsContext();
  const isSelected = selectedTab === value;
  const tabId = `${baseId}-tab-${value}`;
  const panelId = `${baseId}-panel-${value}`;

  if (!isSelected) return null;

  return (
    <div
      role="tabpanel"
      id={panelId}
      aria-labelledby={tabId}
      tabIndex={0}
      className={cn("focus:outline-none animate-in fade-in duration-150", className)}
      {...props}
    >
      {children}
    </div>
  );
}
