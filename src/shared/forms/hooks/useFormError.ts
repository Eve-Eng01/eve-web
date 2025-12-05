/**
 * useFormError Hook
 * Custom hook for handling form errors
 */

import { type FieldErrors, type UseFormReturn } from "react-hook-form";
import { getFirstError, hasFormErrors } from "../utils/formUtils";

export interface UseFormErrorOptions<T extends Record<string, unknown>> {
  form: UseFormReturn<T>;
  apiError?: string | null;
}

export function useFormError<T extends Record<string, unknown>>({
  form,
  apiError,
}: UseFormErrorOptions<T>) {
  const { formState } = form;
  const { errors, isSubmitting } = formState;

  const hasErrors = hasFormErrors(errors);
  const firstError = getFirstError(errors);
  const displayError = apiError || firstError;

  return {
    errors,
    hasErrors,
    firstError,
    displayError,
    isSubmitting,
    formState,
  };
}


