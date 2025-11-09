// Bank data with icons
// Note: In production, these icons should be stored in the assets folder
// For now, using placeholder paths that should be replaced with actual bank icons

export interface Bank {
  value: string;
  label: string;
  icon?: string;
}

export const NIGERIAN_BANKS: Bank[] = [
  {
    value: "uba",
    label: "United Bank for Africa",
    icon: "https://via.placeholder.com/24x24/7417c6/ffffff?text=UBA",
  },
  {
    value: "first-bank",
    label: "First Bank of Nigeria",
    icon: "https://via.placeholder.com/24x24/7417c6/ffffff?text=FBN",
  },
  {
    value: "union-bank",
    label: "Union Bank",
    icon: "https://via.placeholder.com/24x24/7417c6/ffffff?text=UB",
  },
  {
    value: "zenith",
    label: "Zenith Bank of Nigeria",
    icon: "https://via.placeholder.com/24x24/7417c6/ffffff?text=ZB",
  },
  {
    value: "ecobank",
    label: "Eco Bank",
    icon: "https://via.placeholder.com/24x24/7417c6/ffffff?text=EB",
  },
  {
    value: "kuda",
    label: "Kuda Microfinance Bank",
    icon: "https://via.placeholder.com/24x24/7417c6/ffffff?text=K",
  },
  {
    value: "opay",
    label: "Opay NGN",
    icon: "https://via.placeholder.com/24x24/7417c6/ffffff?text=OP",
  },
  {
    value: "moniepoint",
    label: "Monie Point",
    icon: "https://via.placeholder.com/24x24/7417c6/ffffff?text=MP",
  },
];

export const CURRENCIES = [
  { value: "NGN", label: "NGN", countryCode: "NG" },
  { value: "USD", label: "USD", countryCode: "US" },
  { value: "EUR", label: "EUR", countryCode: "EU" },
  { value: "GBP", label: "GBP", countryCode: "GB" },
];

