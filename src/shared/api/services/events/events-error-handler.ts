/**
 * Events Error Handler
 * Utility functions for handling and extracting error messages from API responses
 */

import { AxiosError } from "axios";
import { ApiResponse } from "../../config";

/**
 * Extract error message from API error response
 */
export function extractErrorMessage(error: unknown): string {
  if (!error) {
    return "An unexpected error occurred. Please try again.";
  }

  // Handle Axios errors
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as AxiosError<ApiResponse>;
    const responseData = axiosError.response?.data;

    if (responseData) {
      // Check for message in response
      if (responseData.message) {
        return responseData.message;
      }

      // Check for errors array
      if (responseData.errors && Array.isArray(responseData.errors)) {
        const errorMessages = responseData.errors
          .map((err) => (typeof err === "string" ? err : err.message))
          .filter(Boolean);
        if (errorMessages.length > 0) {
          return errorMessages.join(", ");
        }
      }

      // Check for status message
      if (axiosError.response?.statusText) {
        return axiosError.response.statusText;
      }
    }

    // Handle HTTP status codes
    const status = axiosError.response?.status;
    if (status) {
      switch (status) {
        case 400:
          return "Invalid request. Please check your input and try again.";
        case 401:
          return "You are not authorized. Please log in and try again.";
        case 403:
          return "You don't have permission to perform this action.";
        case 404:
          return "The requested resource was not found.";
        case 409:
          return "A conflict occurred. The resource may already exist.";
        case 422:
          return "Validation failed. Please check your input.";
        case 429:
          return "Too many requests. Please wait a moment and try again.";
        case 500:
          return "Server error. Please try again later.";
        case 503:
          return "Service temporarily unavailable. Please try again later.";
        default:
          return `Request failed with status ${status}. Please try again.`;
      }
    }
  }

  // Handle string errors
  if (typeof error === "string") {
    return error;
  }

  // Handle Error objects
  if (error instanceof Error) {
    return error.message || "An error occurred. Please try again.";
  }

  // Fallback
  return "An unexpected error occurred. Please try again.";
}

/**
 * Check if error is a validation error
 */
export function isValidationError(error: unknown): boolean {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as AxiosError<ApiResponse>;
    const status = axiosError.response?.status;
    return status === 400 || status === 422;
  }
  return false;
}

/**
 * Check if error is an authentication error
 */
export function isAuthenticationError(error: unknown): boolean {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as AxiosError;
    return axiosError.response?.status === 401;
  }
  return false;
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as AxiosError;
    return !axiosError.response && axiosError.request;
  }
  return false;
}

/**
 * Get field-specific validation errors
 */
export function getFieldErrors(error: unknown): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as AxiosError<ApiResponse>;
    const responseData = axiosError.response?.data;

    if (responseData?.errors && Array.isArray(responseData.errors)) {
      responseData.errors.forEach((err) => {
        if (typeof err === "object" && "field" in err && "message" in err) {
          fieldErrors[err.field as string] = err.message as string;
        }
      });
    }
  }

  return fieldErrors;
}

