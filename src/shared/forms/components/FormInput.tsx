/**
 * FormInput Component
 * Reusable input component integrated with React Hook Form
 */

import { forwardRef } from "react";
import {
  type FieldError,
  type FieldValues,
  type Path,
  type UseFormRegister,
} from "react-hook-form";
import { cn } from "@/shared/utils/classnames";

export interface FormInputProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  placeholder?: string;
  register: UseFormRegister<T>;
  error?: FieldError;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  autoComplete?: string;
  autoFocus?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FormInput = <T extends FieldValues>({
  name,
  label,
  type = "text",
  placeholder,
  register,
  error,
  disabled = false,
  required = false,
  className,
  labelClassName,
  inputClassName,
  errorClassName,
  icon,
  iconPosition = "left",
  autoComplete,
  autoFocus,
  onBlur,
  onChange,
}: FormInputProps<T>) => {
  const { onChange: registerOnChange, onBlur: registerOnBlur, ...registerProps } = register(name);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    registerOnChange(e);
    onChange?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
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

      <div className="relative">
        {icon && iconPosition === "left" && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}

        <input
          id={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          className={cn(
            "w-full px-4 py-3 border rounded-[14px] transition-all outline-none",
            "text-[#2D2D2D]",
            "focus:ring-2 focus:ring-purple-500 focus:border-transparent",
            icon && iconPosition === "left" && "pl-13",
            icon && iconPosition === "right" && "pr-13",
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-purple-500",
            disabled && "bg-gray-100 cursor-not-allowed opacity-60",
            inputClassName
          )}
          {...registerProps}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${name}-error` : undefined}
        />

        {icon && iconPosition === "right" && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
      </div>

      {error && (
        <p
          id={`${name}-error`}
          role="alert"
          className={cn(
            "mt-2 text-sm text-red-600",
            errorClassName
          )}
        >
          {error.message}
        </p>
      )}
    </div>
  );
};


