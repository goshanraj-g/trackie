// components/ui/form-field.tsx
"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils"; // ShadCN’s helper – already in your project

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visible label text */
  label: string;
  /** Matches the id of the control passed as children */
  htmlFor: string;
  /** Usually <Input>, <Select>, or <Textarea> */
  children: React.ReactNode;
  /** Set true for multi-line controls like Textarea so top edges align */
  alignTop?: boolean;
}

/**
 * Grid-based row that keeps a fixed label column (9 rem) and
 * an auto-growing control column. Works great in dark / light modes.
 */
export function FormField({
  label,
  htmlFor,
  children,
  alignTop = false,
  className,
  ...props
}: FormFieldProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-[7rem_1fr]",
        alignTop ? "items-start" : "items-center",
        className
      )}
      {...props}
    >
      <Label
        htmlFor={htmlFor}
        className="text-sm font-medium text-muted-foreground select-none"
      >
        {label}
      </Label>
      {children}
    </div>
  );
}
