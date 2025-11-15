/**
 * Vendor Category Enum
 * All available vendor categories as defined in the design
 */
export enum VendorCategory {
  PHOTOGRAPHY = "photography",
  CATERER = "caterer",
  ARTIST = "artist",
  PLANNER = "planner",
  CHAUFFEUR = "chauffeur",
  CATERING = "catering",
  DJ = "dj",
  MAKEUP_ARTIST = "makeup_artist",
  TRANSPORTATION = "transportation",
  SERVICE = "service",
  RENTAL_SERVICE = "rental_service",
  BAKER = "baker",
  LIVE_BAND = "live_band",
  SECURITY = "security",
  BARTENDER = "bartender",
  VIDEOGRAPHER = "videographer",
  DECORATOR = "decorator",
  FLORIST = "florist",
  MUSICIAN = "musician",
  HAIRSTYLIST = "hairstylist",
  LIGHTING = "lighting",
  PROVIDER = "provider",
  MC_HOST = "mc_host",
  INVITATION = "invitation",
  TECHNICIAN = "technician",
}

/**
 * Vendor Category Labels
 * Human-readable labels for each category
 */
export const VENDOR_CATEGORY_LABELS: Record<VendorCategory, string> = {
  [VendorCategory.PHOTOGRAPHY]: "Photography",
  [VendorCategory.CATERER]: "Caterer",
  [VendorCategory.ARTIST]: "Artist",
  [VendorCategory.PLANNER]: "Planner",
  [VendorCategory.CHAUFFEUR]: "Chauffeur",
  [VendorCategory.CATERING]: "Catering",
  [VendorCategory.DJ]: "DJ",
  [VendorCategory.MAKEUP_ARTIST]: "Makeup Artist",
  [VendorCategory.TRANSPORTATION]: "Transportation",
  [VendorCategory.SERVICE]: "Service",
  [VendorCategory.RENTAL_SERVICE]: "Rental Service",
  [VendorCategory.BAKER]: "Baker",
  [VendorCategory.LIVE_BAND]: "Live Band",
  [VendorCategory.SECURITY]: "Security",
  [VendorCategory.BARTENDER]: "Bartender",
  [VendorCategory.VIDEOGRAPHER]: "Videographer",
  [VendorCategory.DECORATOR]: "Decorator",
  [VendorCategory.FLORIST]: "Florist",
  [VendorCategory.MUSICIAN]: "Musician",
  [VendorCategory.HAIRSTYLIST]: "Hairstylist",
  [VendorCategory.LIGHTING]: "Lighting",
  [VendorCategory.PROVIDER]: "Provider",
  [VendorCategory.MC_HOST]: "MC/Host",
  [VendorCategory.INVITATION]: "Invitation",
  [VendorCategory.TECHNICIAN]: "Technician",
};

/**
 * Get all vendor categories as options array
 * Useful for dropdowns and selection components
 */
export const getAllVendorCategories = (): Array<{
  value: string;
  label: string;
}> => {
  return Object.values(VendorCategory).map((category) => ({
    value: category,
    label: VENDOR_CATEGORY_LABELS[category],
  }));
};

