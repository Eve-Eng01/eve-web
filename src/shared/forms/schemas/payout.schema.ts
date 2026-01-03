/**
 * Payout Account Form Validation Schemas
 * Yup schemas for payout account-related forms
 */

import * as yup from "yup";

/**
 * Create/Edit Payout Account Schema
 */
export const payoutAccountSchema = yup.object().shape({
  currency: yup.string().required("Currency is required"),
  accountNumber: yup
    .string()
    .required("Account number is required")
    .trim()
    .matches(/^\d+$/, "Account number must contain only numbers")
    .min(10, "Account number must be at least 10 digits"),
  bankName: yup
    .string()
    .required("Bank name is required")
    .trim(),
  accountName: yup
    .string()
    .required("Account name is required")
    .trim()
    .min(2, "Account name must be at least 2 characters"),
  countryCode: yup.string().notRequired().default(""),
});

export type PayoutAccountFormData = yup.InferType<typeof payoutAccountSchema>;

