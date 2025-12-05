/**
 * Form Utilities
 * Helper functions for form handling
 */

import { type FieldErrors, type FieldValues } from "react-hook-form";

/**
 * Get the first error message from form errors
 */
export function getFirstError<T extends FieldValues>(
  errors: FieldErrors<T>
): string | null {
  const firstError = Object.values(errors)[0];
  if (!firstError) return null;

  if (typeof firstError === "string") {
    return firstError;
  }

  if (firstError.message) {
    return firstError.message;
  }

  // Handle nested errors
  if (typeof firstError === "object") {
    const nestedError = Object.values(firstError)[0];
    if (nestedError && typeof nestedError === "object" && "message" in nestedError) {
      return nestedError.message as string;
    }
  }

  return "Please fix the errors in the form";
}

/**
 * Check if form has any errors
 */
export function hasFormErrors<T extends FieldValues>(
  errors: FieldErrors<T>
): boolean {
  return Object.keys(errors).length > 0;
}

/**
 * Get all error messages from form errors
 */
export function getAllErrors<T extends FieldValues>(
  errors: FieldErrors<T>
): string[] {
  const errorMessages: string[] = [];

  const extractErrors = (obj: unknown, prefix = ""): void => {
    if (typeof obj === "string") {
      errorMessages.push(prefix ? `${prefix}: ${obj}` : obj);
      return;
    }

    if (obj && typeof obj === "object") {
      if ("message" in obj && typeof obj.message === "string") {
        errorMessages.push(prefix ? `${prefix}: ${obj.message}` : obj.message);
        return;
      }

      // Handle nested objects
      for (const [key, value] of Object.entries(obj)) {
        const newPrefix = prefix ? `${prefix}.${key}` : key;
        extractErrors(value, newPrefix);
      }
    }
  };

  extractErrors(errors);
  return errorMessages;
}

/**
 * Format field name for display
 */
export function formatFieldName(fieldName: string): string {
  return fieldName
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}


