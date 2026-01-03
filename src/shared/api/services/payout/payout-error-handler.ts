/**
 * Payout Error Handler
 * Utility functions for handling and extracting error messages from payout API responses
 */

import { extractErrorMessage } from "../events/events-error-handler";

/**
 * Extract error message from payout API error response
 * Reuses the events error handler for consistency
 */
export function extractPayoutErrorMessage(error: unknown): string {
  return extractErrorMessage(error);
}

