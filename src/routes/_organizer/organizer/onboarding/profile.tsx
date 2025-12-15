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
import { GooglePlacesAutocomplete } from "@components/accessories/google-places-autocomplete";
import { ProgressSteps } from "../../../../components/accessories/progress-steps";
import countries from "world-countries";
import { onboardingSchema } from "@/shared/forms/schemas/onboarding.schema";
import { OrganizerSocialsStep } from "./organizer-steps/socials";
import { OrganizerReviewStep } from "./organizer-steps/review";
import { PortfolioLink } from "./sub-services/four";
import "./onboard.css";

export const Route = createFileRoute("/_organizer/organizer/onboarding/profile")({
  component: RouteComponent,
});

interface ExtendedFormData {
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
  const [formData, setFormData] = useState<ExtendedFormData>({
    companyName: "",
    businessType: null,
    country: null,
    phoneData: undefined,
    location: "",
  });
  const [portfolioLinks, setPortfolioLinks] = useState<PortfolioLink[]>([]);
  const [countries, setCountries] = useState<DropdownOption[]>([]);

  const form = useForm({
    resolver: yupResolver(onboardingSchema) as any,
    mode: "onChange",
    defaultValues: {
      companyName: "",
      country: "",
      phone: {
        countryCode: "",
        number: "",
      },
      location: "",
      businessType: undefined,
    },
  });

  const { handleSubmit, formState, setValue } = form;
  const { errors, isValid } = formState;

  // Load countries on component mount
  useEffect(() => {
    const countriesOptions = getCountriesOptions();
    setCountries(countriesOptions);
  }, []);

  const handleAddNewCountry = (newOption: DropdownOption) => {
    setCountries([...countries, newOption]);
  };

  const handleContinue = () => {
    if (currentTab === 1) {
      // Validate step 1 before continuing
      handleSubmit(
        () => {
          setCurrentTab(2);
        },
        (validationErrors) => {
          console.error("Validation errors:", validationErrors);
        }
      )();
    } else if (currentTab < 3) {
      setCurrentTab(currentTab + 1);
    }
  };

  const handleGoBack = () => {
    if (currentTab > 1) {
      setCurrentTab(currentTab - 1);
    }
  };

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
      setValue("businessType" as any, formData.businessType.value, { shouldValidate: false });
    }
  }, [formData, setValue]);

  const renderTabContent = () => {
    switch (currentTab) {
      case 1:
        return (
          <div className="mx-auto w-full max-w-2xl px-4 sm:px-6">
            <div className="text-center mb-6 sm:mb-8">
              <div className="mx-auto mb-2 flex items-center justify-center">
                <img src={logo} alt="" className="w-[60px] h-[60px]" />
              </div>
              <h2 className="text-black header text-2xl sm:text-[32px] leading-snug sm:leading-tight">
                Let's Get Your Organization Set Up
              </h2>
              <p className="text-black text-sm sm:text-base mt-1">
                Start by sharing a few details about your event planning
                company.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(handleContinue)}
              className="space-y-4 sm:space-y-6"
            >
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

              <DropdownInput
               
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
                <p className="text-red-500 text-sm mt-1 mb-2">
                  {errors.country.message}
                </p>
              )}

              <div>
                <CustomPhoneInput
                  label="Event Organizer Number"
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
                    !formData.country ||
                    !formData.phoneData ||
                    !formData.location
                  }
                  title="Continue"
                />
              </div>
            </form>
          </div>
        );

      case 2:
        return (
          <OrganizerSocialsStep
            continue={handleContinue}
            back={handleGoBack}
            portfolioLinks={portfolioLinks}
            onPortfolioLinksChange={setPortfolioLinks}
          />
        );
      case 3:
        return (
          <OrganizerReviewStep
            continue={handleContinue}
            back={handleGoBack}
            formData={{
              ...formData,
              businessType: formData.businessType?.value || null,
            }}
            portfolioLinks={portfolioLinks}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen border bg-white flex flex-col items-center pt-12 relative">
      <div className="w-full max-w-2xl">
        <ProgressSteps total={3} current={currentTab} />
        {renderTabContent()}
      </div>
      {/* <DecorativeBottomImage /> */}
    </div>
  );
}
