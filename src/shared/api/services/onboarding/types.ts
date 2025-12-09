/**
 * Onboarding Service Types
 * Type definitions for onboarding-related API requests and responses
 */

export type UserRole = "organizer" | "vendor";

export interface PhoneNumber {
  countryCode: string;
  number: string;
}

export interface PortfolioLink {
  brand: string;
  url: string;
}

export interface CreateOnboardingRequest {
  role: UserRole;
  companyName: string;
  country: string;
  phone: PhoneNumber;
  location: string;
  businessType?: string;
  links?: PortfolioLink[];
  completed?: boolean;
}

export interface OnboardingProfile {
  _id: string;
  organizer_id?: string;
  vendor_id?: string;
  organization_name?: string;
  company_name?: string;
  country: string;
  phone: PhoneNumber & { e164: string };
  location: string;
  is_verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOnboardingResponse {
  profile: OnboardingProfile[];
}

