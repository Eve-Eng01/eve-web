import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import logo from "@assets/evaLogo.png";
import { CustomPhoneInput, type PhoneData } from "@components/accessories/custom-phone-input";
import { type DropdownOption } from "@components/accessories/dropdown-input";
import { InputField } from "@components/accessories/input-field";
import { DropdownInput } from "@components/accessories/dropdown-input";
import { CustomButton } from "@components/accessories/button";
import { ProgressSteps } from "../../../../components/accessories/progress-steps";
import countries from "world-countries";
import { ServiceOne } from "./sub-services/one.tsx";
import { ServiceTwo } from "./sub-services/two.tsx";
import { ServiceThree } from "./sub-services/three.tsx";
import { ServiceFour } from "./sub-services/four.tsx";
import { VendorReview } from "./sub-services/review";
import { GooglePlacesAutocomplete } from "@components/accessories/google-places-autocomplete.tsx";
import * as yup from "yup";
import { useCreateOnboardingProfile } from "@/shared/api/services/onboarding";
import type { CreateOnboardingRequest } from "@/shared/api/services/onboarding/types";

export const Route = createFileRoute("/_vendor/vendor/onboarding/profile")({
  component: RouteComponent,
});

// Vendor-specific validation schema
const vendorOnboardingSchema = yup.object({
  companyName: yup
    .string()
    .required("Company name is required")
    .min(1, "Company name must be at least 1 character")
    .trim(),
  businessType: yup
    .string()
    .required("Business type is required"),
  country: yup
    .string()
    .required("Country is required")
    .min(1, "Country must be at least 1 character"),
  phone: yup.object().shape({
    countryCode: yup
      .string()
      .required("Country code is required")
      .matches(/^\+/, "Country code must start with +"),
    number: yup
      .string()
      .required("Phone number is required")
      .min(5, "Phone number must be at least 5 digits")
      .matches(/^\d+$/, "Phone number must contain only digits"),
  }),
  location: yup
    .string()
    .required("Location is required")
    .min(1, "Location must be at least 1 character")
    .trim(),
});

interface FormData {
  companyName: string;
  businessType: DropdownOption | null;
  country: DropdownOption | null;
  phoneData: PhoneData | undefined;
  location: string;
}

export const getCountriesOptions = (): DropdownOption[] => {
  return countries
    .map((country) => ({
      value: country.cca2, // ISO 3166-1 alpha-2 code (e.g., "US", "NG")
      label: country.name.common,
      flag: country.flag, // Common country name (e.g., "United States", "Nigeria")
    }))
    .sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically
};

export function RouteComponent() {
  const [currentTab, setCurrentTab] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    businessType: null,
    country: null,
    phoneData: undefined,
    location: "",
  });

  const [businessTypes, setBusinessTypes] = useState<DropdownOption[]>([
    { value: "catering", label: "Catering/Baking" },
    { value: "videography", label: "Videographers" },
    { value: "photography", label: "Photographers" },
    { value: "music", label: "Musicians & DJs" },
    { value: "security", label: "Security Service" },
  ]);
  const [countries, setCountries] = useState<DropdownOption[]>([]);

  // API mutation hook - disable auto-navigation for vendors
  const createProfileMutation = useCreateOnboardingProfile({
    autoNavigate: false,
  });

  // Initialize React Hook Form
  const form = useForm({
    resolver: yupResolver(vendorOnboardingSchema) as any,
    mode: "onChange",
    defaultValues: {
      companyName: "",
      businessType: "",
      country: "",
      phone: {
        countryCode: "",
        number: "",
      },
      location: "",
    },
  });

  const { handleSubmit, formState, setValue } = form;
  const { errors, isValid } = formState;

  // Load countries on component mount
  useEffect(() => {
    const countriesOptions = getCountriesOptions();
    setCountries(countriesOptions);
  }, []);

  // Update form values when formData changes
  useEffect(() => {
    if (formData.companyName) {
      setValue("companyName", formData.companyName);
    }
    if (formData.country) {
      setValue("country", formData.country.label);
    }
    if (formData.location) {
      setValue("location", formData.location);
    }
    if (formData.phoneData) {
      setValue("phone.countryCode", formData.phoneData.country.dial_code);
      setValue("phone.number", formData.phoneData.phoneNumber);
    }
    if (formData.businessType) {
      setValue("businessType", formData.businessType.value, { shouldValidate: false });
    }
  }, [formData, setValue]);

  const handleAddNewCountry = (newOption: DropdownOption) => {
    setCountries([...countries, newOption]);
  };

  const handleAddNewBusinessType = (newOption: DropdownOption) => {
    setBusinessTypes([...businessTypes, newOption]);
  };

  const handleContinue = () => {
    if (currentTab === 1) {
      // Validate step 1 and make API call before continuing
      handleSubmit(
        async () => {
          // Validation passed, now make API call
          if (!formData.phoneData || !formData.country || !formData.businessType) {
            return;
          }

          // Prepare request data
          const requestData: CreateOnboardingRequest = {
            role: "vendor",
            companyName: formData.companyName,
            country: formData.country.label,
            phone: {
              countryCode: formData.phoneData.country.dial_code,
              number: formData.phoneData.phoneNumber,
            },
            location: formData.location,
            businessType: formData.businessType.value,
          };

          try {
            await createProfileMutation.mutateAsync(requestData);
            // On success, proceed to next tab
            setCurrentTab(2);
          } catch (error) {
            // Error is handled by the mutation hook (shows toast)
            console.error("Failed to create vendor profile:", error);
          }
        },
        (validationErrors) => {
          console.error("Validation errors:", validationErrors);
        }
      )();
    } else if (currentTab < 6) {
      setCurrentTab(currentTab + 1);
    }
  };

  const handleGoBack = () => {
    if (currentTab > 1) {
      setCurrentTab(currentTab - 1);
    }
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case 1:
        return (
          <div className="mx-auto w-full max-w-2xl px-4 sm:px-6">
            <div className="text-center  mb-6 sm:mb-8">
              <div className="mx-auto mb-1 sm:mb-2 flex items-center justify-center">
                <img src={logo} alt="" className="w-[60px] h-[60px]" />
              </div>
              <h2 className="text-black header text-2xl sm:text-[32px] leading-snug sm:leading-tight">
                Showcase Your Services, Get Booked
              </h2>
              <p className="text-black para text-sm sm:text-base mt-1">
                Join a network of trusted vendors and grow your business by
                connecting with event planners and attendees.
              </p>
            </div>

            <form onSubmit={handleSubmit(handleContinue)} className="space-y-4 sm:space-y-6">
              <div>
                <InputField
                  parentClassName=""
                  label="Enter Registered Company Name"
                  placeholder="Eve Event Platform"
                  value={formData.companyName}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({ ...formData, companyName: value });
                    setValue("companyName", value, { shouldValidate: true });
                  }}
                />
                {errors.companyName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.companyName.message}
                  </p>
                )}
              </div>

              <div>
                <DropdownInput
                  className=""
                  label="Business Type"
                  options={businessTypes}
                  value={formData.businessType}
                  onChange={(option) => {
                    setFormData({ ...formData, businessType: option });
                    setValue("businessType", option?.value || "", {
                      shouldValidate: true,
                    });
                  }}
                  placeholder="Select business type"
                  searchable={true}
                  addNewOption={true}
                  onAddNew={handleAddNewBusinessType}
                />
                {errors.businessType && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.businessType.message}
                  </p>
                )}
              </div>

             
                <DropdownInput
                  className=""
                  label="Select your Country"
                  options={countries}
                  value={formData.country}
                  onChange={(option) => {
                    setFormData({ ...formData, country: option });
                    setValue("country", option?.label || "", {
                      shouldValidate: true,
                    });
                  }}
                  placeholder="Select your Country"
                  searchable={true}
                  addNewOption={true}
                  onAddNew={handleAddNewCountry}
                />
                {errors.country && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.country.message}
                  </p>
                )}
 

              <div>
                <CustomPhoneInput
                  label="Vendor Number"
                  value={formData.phoneData}
                  onChange={(data) => {
                    setFormData({ ...formData, phoneData: data });
                    if (data) {
                      setValue("phone.countryCode", data.country.dial_code, {
                        shouldValidate: true,
                      });
                      setValue("phone.number", data.phoneNumber, {
                        shouldValidate: true,
                      });
                    }
                  }}
                  phonePlaceholder="Phone number"
                  countryPlaceholder="Select country"
                />
                <div className="mt-1">
                  {errors.phone && (
                    <p className="text-red-500 text-sm">
                      {errors.phone.countryCode?.message ||
                        errors.phone.number?.message ||
                        "Phone number is required"}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <GooglePlacesAutocomplete
                  parentClassName=""
                  label="Location"
                  placeholder="Ibeju Lekki Lagos, Nigeria."
                  value={formData.location}
                  onChange={(value) => {
                    setFormData({ ...formData, location: value });
                    setValue("location", value, { shouldValidate: true });
                  }}
                  error={errors.location?.message}
                />
              </div>

              <div className="pt-2 mb-12 sm:pt-3">
                <CustomButton
                  type="submit"
                  disabled={
                    !isValid ||
                    !formData.companyName ||
                    !formData.businessType ||
                    !formData.country ||
                    !formData.phoneData ||
                    !formData.location ||
                    createProfileMutation.isPending
                  }
                  title={createProfileMutation.isPending ? "Saving..." : "Continue"}
                  loading={createProfileMutation.isPending}
                />
              </div>
            </form>
          </div>
        );
  case 2 : return <ServiceOne continue={handleContinue} back={handleGoBack} />;
  case 3 : return <ServiceTwo continue={handleContinue} back={handleGoBack} />;
  case 4 : return <ServiceThree continue={handleContinue} back={handleGoBack} />;
  case 5 : return <ServiceFour continue={handleContinue} back={handleGoBack} />;

      case 6:
        return (
          <VendorReview
            continue={handleContinue}
            back={handleGoBack}
            formData={{
              ...formData,
              businessType: formData.businessType?.value || null,
            }}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen border bg-white flex flex-col items-center pt-12 relative">
    <div className="w-full max-w-2xl">
      <ProgressSteps total={6} current={currentTab} />
      {renderTabContent()}
    </div>
    {/* <DecorativeBottomImage /> */}
  </div>
  );
}
