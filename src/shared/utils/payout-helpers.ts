/**
 * Payout Helper Utilities
 * Shared utilities for payout-related operations
 */

import { CURRENCIES } from "./banks";
import type { PayoutAccount } from "@/shared/api/services/payout/types";
import type { PayoutAccountData } from "@/routes/_organizer/organizer/account/payout-setting";

/**
 * Currency to Country Code mapping cache
 * Prevents repeated lookups
 */
const currencyToCountryMap = new Map<string, string>(
  CURRENCIES.map((currency) => [currency.value, currency.countryCode])
);

/**
 * Get country code from currency
 * Uses cached mapping for performance
 */
export function getCountryCodeFromCurrency(currency: string, fallbackCountry?: string): string {
  return currencyToCountryMap.get(currency) || fallbackCountry || "NG";
}

/**
 * Convert API PayoutAccount to frontend PayoutAccountData
 * Optimized version with cached currency lookup
 */
export function mapPayoutAccountToFrontend(account: PayoutAccount): PayoutAccountData {
  const countryCode = getCountryCodeFromCurrency(account.currency, account.country);

  return {
    id: account._id,
    accountNumber: account.accountNumber,
    bankName: account.bankName,
    accountName: account.accountHolderName,
    currency: account.currency,
    countryCode,
  };
}

