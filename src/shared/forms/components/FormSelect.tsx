/**
 * FormSelect Component
 * Reusable select component integrated with React Hook Form
 */

import {
  type FieldError,
  type FieldValues,
  type Path,
  type UseFormRegister,
} from "react-hook-form";
import { cn } from "@/shared/utils/classnames";

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface FormSelectProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  register: UseFormRegister<T>;
  error?: FieldError;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  selectClassName?: string;
  errorClassName?: string;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function FormSelect<T extends FieldValues>({
  name,
  label,
  options,
  placeholder,
  register,
  error,
  disabled = false,
  required = false,
  className,
  labelClassName,
  selectClassName,
  errorClassName,
  onBlur,
  onChange,
}: FormSelectProps<T>) {
  const { onChange: registerOnChange, onBlur: registerOnBlur, ...registerProps } = register(name);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    registerOnChange(e);
    onChange?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
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

      <select
        id={name}
        disabled={disabled}
        className={cn(
          "w-full px-4 py-3 border rounded-[14px] transition-all outline-none",
          "text-[#2D2D2D] bg-white",
          "focus:ring-2 focus:ring-purple-500 focus:border-transparent",
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-purple-500",
          disabled && "bg-gray-100 cursor-not-allowed opacity-60",
          selectClassName
        )}
        {...registerProps}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${name}-error` : undefined}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

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


