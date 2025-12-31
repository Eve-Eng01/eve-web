/**
 * Profile Service Types
 * Type definitions for profile-related API requests and responses
 */

export interface UploadProfilePictureResponse {
  url: string;
  assetId?: string;
  provider?: string;
}

export interface UpdateProfileRequest {
  organization_name?: string;
  country?: string;
  phone?: {
    countryCode: string;
    number: string;
  };
  location?: string;
  links?: Array<{
    brand: string;
    url: string;
  }>;
}

export interface UpdateProfileResponse {
  message: string;
  profile: {
    _id: string;
    organization_name?: string;
    country?: string;
    phone?: {
      countryCode: string;
      number: string;
    };
    location?: string;
    links?: Array<{
      brand: string;
      url: string;
    }>;
  };
}

