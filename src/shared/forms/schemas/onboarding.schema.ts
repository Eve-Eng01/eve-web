/**
 * Onboarding Form Validation Schemas
 * Yup schemas for onboarding-related forms
 */

import * as yup from "yup";

/**
 * Phone Number Schema
 */
export const phoneSchema = yup.object().shape({
  countryCode: yup
    .string()
    .required("Country code is required")
    .matches(/^\+/, "Country code must start with +"),
  number: yup
    .string()
    .required("Phone number is required")
    .min(5, "Phone number must be at least 5 digits")
    .matches(/^\d+$/, "Phone number must contain only digits"),
});

/**
 * Onboarding Form Schema (for organizer and vendor)
 */
export const onboardingSchema = yup.object({
  companyName: yup
    .string()
    .required("Company/Organization name is required")
    .min(1, "Company/Organization name must be at least 1 character")
    .trim(),
  country: yup
    .string()
    .required("Country is required")
    .min(1, "Country must be at least 1 character"),
  phone: phoneSchema.required("Phone number is required"),
  location: yup
    .string()
    .required("Location is required")
    .min(1, "Location must be at least 1 character")
    .trim(),
  businessType: yup.string().nullable().notRequired(),
});

export type OnboardingFormData = yup.InferType<typeof onboardingSchema>;

