/**
 * FormError Component
 * Reusable error display component for form-level errors
 */

import { type FieldError } from "react-hook-form";
import { cn } from "@/shared/utils/classnames";

export interface FormErrorProps {
  error?: FieldError | string | null;
  className?: string;
  id?: string;
}

export function FormError({ error, className, id }: FormErrorProps) {
  if (!error) return null;

  const errorMessage = typeof error === "string" ? error : error.message;

  return (
    <div
      id={id}
      role="alert"
      className={cn(
        " text-red-700 px-4 py-3 rounded-[14px] text-sm",
        className
      )}
    >
      {errorMessage}
    </div>
  );
}


