"use client";

/**
 * components/ui/input.tsx
 *
 * Form inputs primitive library for Vayam.
 * Includes TextInput, SearchInput, TextArea, Select, Checkbox, Radio, Toggle, DateInput.
 */

import React, { forwardRef, useId } from "react";
import { cn } from "@/lib/utils/cn";
import { Search, X, ChevronDown } from "lucide-react";

/* --------------------------------------------------------------------------
   TextInput
   -------------------------------------------------------------------------- */
export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      startIcon,
      endIcon,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-label text-foreground font-semibold"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {startIcon && (
            <div className="absolute left-3.5 text-muted-foreground pointer-events-none flex items-center z-10">
              {startIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={cn(
              "input",
              Boolean(startIcon) && "!pl-10",
              Boolean(endIcon) && "!pr-10",
              Boolean(error) && "border-destructive focus:ring-destructive",
              className
            )}
            {...props}
          />
          {endIcon && (
            <div className="absolute right-3.5 text-muted-foreground flex items-center z-10">
              {endIcon}
            </div>
          )}
        </div>
        {error ? (
          <p id={errorId} className="text-caption text-destructive font-medium">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-caption text-muted-foreground">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);
TextInput.displayName = "TextInput";

/* --------------------------------------------------------------------------
   SearchInput
   -------------------------------------------------------------------------- */
export interface SearchInputProps extends Omit<TextInputProps, "startIcon"> {
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, onClear, className, placeholder = "Search...", ...props }, ref) => {
    const hasValue = Boolean(value);

    return (
      <TextInput
        ref={ref}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        startIcon={<Search size={16} />}
        endIcon={
          hasValue && onClear ? (
            <button
              type="button"
              onClick={onClear}
              className="p-1 text-muted-foreground hover:text-foreground rounded-full"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          ) : undefined
        }
        className={className}
        {...props}
      />
    );
  }
);
SearchInput.displayName = "SearchInput";

/* --------------------------------------------------------------------------
   TextArea
   -------------------------------------------------------------------------- */
export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, helperText, error, id, disabled, rows = 4, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-label text-foreground font-semibold"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          className={cn(
            "input min-h-[100px] resize-y",
            Boolean(error) && "border-destructive",
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-caption text-destructive font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-caption text-muted-foreground">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
TextArea.displayName = "TextArea";

/* --------------------------------------------------------------------------
   Select
   -------------------------------------------------------------------------- */
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  helperText?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, helperText, error, id, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="text-label text-foreground font-semibold"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "input cursor-pointer bg-card appearance-none !pr-10",
              Boolean(error) && "border-destructive",
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 text-muted-foreground pointer-events-none flex items-center z-10">
            <ChevronDown size={16} />
          </div>
        </div>
        {error ? (
          <p className="text-caption text-destructive font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-caption text-muted-foreground">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
Select.displayName = "Select";

/* --------------------------------------------------------------------------
   Checkbox
   -------------------------------------------------------------------------- */
export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  helperText?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, helperText, id, disabled, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;

    return (
      <div className="flex items-start gap-2.5">
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          disabled={disabled}
          className={cn(
            "h-4 w-4 rounded border-border text-accent focus:ring-accent accent-accent cursor-pointer mt-0.5",
            disabled && "cursor-not-allowed opacity-50",
            className
          )}
          {...props}
        />
        {label && (
          <div className="flex flex-col">
            <label
              htmlFor={checkboxId}
              className={cn(
                "text-body-sm text-foreground cursor-pointer select-none font-medium",
                disabled && "cursor-not-allowed opacity-50"
              )}
            >
              {label}
            </label>
            {helperText && (
              <p className="text-caption text-muted-foreground">{helperText}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

/* --------------------------------------------------------------------------
   Radio
   -------------------------------------------------------------------------- */
export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id, disabled, ...props }, ref) => {
    const generatedId = useId();
    const radioId = id || generatedId;

    return (
      <div className="flex items-center gap-2.5">
        <input
          ref={ref}
          type="radio"
          id={radioId}
          disabled={disabled}
          className={cn(
            "h-4 w-4 border-border text-accent focus:ring-accent accent-accent cursor-pointer",
            disabled && "cursor-not-allowed opacity-50",
            className
          )}
          {...props}
        />
        {label && (
          <label
            htmlFor={radioId}
            className={cn(
              "text-body-sm text-foreground cursor-pointer select-none font-medium",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);
Radio.displayName = "Radio";

/* --------------------------------------------------------------------------
   Toggle / Switch
   -------------------------------------------------------------------------- */
export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
  className,
}: ToggleProps) {
  const id = useId();

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          checked ? "bg-accent" : "bg-muted",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-card shadow-sm ring-0 transition duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
      {label && (
        <label
          htmlFor={id}
          className="text-body-sm text-foreground font-medium cursor-pointer"
        >
          {label}
        </label>
      )}
    </div>
  );
}

/* --------------------------------------------------------------------------
   DateInput
   -------------------------------------------------------------------------- */
export const DateInput = forwardRef<HTMLInputElement, TextInputProps>(
  (props, ref) => <TextInput ref={ref} type="date" {...props} />
);
DateInput.displayName = "DateInput";
