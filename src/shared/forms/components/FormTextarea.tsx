/**
 * FormTextarea Component
 * Reusable textarea component integrated with React Hook Form
 */

import {
  type FieldError,
  type FieldValues,
  type Path,
  type UseFormRegister,
} from "react-hook-form";
import { cn } from "@/shared/utils/classnames";

export interface FormTextareaProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  register: UseFormRegister<T>;
  error?: FieldError;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  className?: string;
  labelClassName?: string;
  textareaClassName?: string;
  errorClassName?: string;
  autoComplete?: string;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function FormTextarea<T extends FieldValues>({
  name,
  label,
  placeholder,
  register,
  error,
  disabled = false,
  required = false,
  rows = 4,
  className,
  labelClassName,
  textareaClassName,
  errorClassName,
  autoComplete,
  onBlur,
  onChange,
}: FormTextareaProps<T>) {
  const { onChange: registerOnChange, onBlur: registerOnBlur, ...registerProps } = register(name);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    registerOnChange(e);
    onChange?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    registerOnBlur(e);
    onBlur?.(e);
  };

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label
          htmlFor={name}
          className={cn(
            "block text-sm font-medium text-gray-700 mb-2",
            required && "after:content-['*'] after:ml-0.5 after:text-red-500",
            labelClassName
          )}
        >
          {label}
        </label>
      )}

      <textarea
        id={name}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        autoComplete={autoComplete}
        className={cn(
          "w-full px-4 py-3 border rounded-[14px] transition-all outline-none resize-none",
          "text-[#2D2D2D]",
          "focus:ring-2 focus:ring-purple-500 focus:border-transparent",
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-purple-500",
          disabled && "bg-gray-100 cursor-not-allowed opacity-60",
          textareaClassName
        )}
        {...registerProps}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${name}-error` : undefined}
      />

      {error && (
        <p
          id={`${name}-error`}
          role="alert"
          className={cn("mt-2 text-sm text-red-600", errorClassName)}
        >
          {error.message}
        </p>
      )}
    </div>
  );
}


