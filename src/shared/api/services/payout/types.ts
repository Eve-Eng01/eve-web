/**
 * Payout Service Types
 * Type definitions for payout-related API requests and responses
 */

/**
 * Payout Account
 */
export interface PayoutAccount {
  _id: string;
  userId: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  currency: string;
  country: string;
  isDefault: boolean;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

/**
 * Create Payout Account Request
 */
export interface CreatePayoutAccountRequest {
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  currency: string;
  country: string;
  isDefault?: boolean;
}

/**
 * Create Payout Account Response
 */
export interface CreatePayoutAccountResponse {
  payoutAccount: PayoutAccount;
}

/**
 * Update Payout Account Request
 */
export interface UpdatePayoutAccountRequest {
  bankName?: string;
  accountNumber?: string;
  accountHolderName?: string;
  isDefault?: boolean;
  verified?: boolean;
}

/**
 * Update Payout Account Response
 */
export interface UpdatePayoutAccountResponse {
  account: PayoutAccount;
}

/**
 * Get Payout Accounts Response
 */
export interface GetPayoutAccountsResponse {
  accounts: PayoutAccount[];
}

/**
 * Get Payout Account Response
 */
export interface GetPayoutAccountResponse {
  account: PayoutAccount;
}

/**
 * Delete Payout Account Response
 */
export interface DeletePayoutAccountResponse {
  message: string;
}

