import { ServiceOneProps } from "./one";
import { CustomButton } from "@components/accessories/button";
import logo from "@assets/evaLogo.png";
import { useState } from "react";
import { useUpdateOnboardingProfile } from "@/shared/api/services/onboarding";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface PricingOption {
  id: string;
  title: string;
  description: string;
  isSelected: boolean;
  rate: string;
  currency: string;
  fee: string;
}

// Validation schema for pricing
const pricingSchema = yup.object({
  rate: yup
    .string()
    .required("Rate is required")
    .test("is-valid-number", "Please enter a valid amount", (value) => {
      if (!value) return false;
      const numValue = Number.parseFloat(value.replace(/,/g, ""));
      return !Number.isNaN(numValue) && numValue > 0;
    }),
  rateType: yup.string().required("Rate type is required"),
  currency: yup.string().required("Currency is required"),
});

export function ServiceThree({
  continue: handleContinue,
  back: handleGoBack,
}: ServiceOneProps) {
  const [pricingOptions, setPricingOptions] = useState<PricingOption[]>([
    {
      id: "hourly",
      title: "Hourly Rate",
      description: "Charge clients based on time spent working.",
      isSelected: true,
      rate: "10,000",
      currency: "NGN",
      fee: "/ hr",
    },
    {
      id: "fixed",
      title: "Minimum Project Fee",
      description: "The minimum amount you're willing to accept.",
      isSelected: false,
      rate: "0.0",
      currency: "NGN",
      fee: "/ project",
    },
    {
      id: "package",
      title: "Package Pricing",
      description: "Offer services as fixed-price packages.",
      isSelected: false,
      rate: "0.0",
      currency: "NGN",
      fee: "/ package",
    },
  ]);

  // API mutation hook
  const updateProfile = useUpdateOnboardingProfile({
    onSuccess: () => {
      handleContinue();
    },
  });

  // Form validation
  const form = useForm({
    resolver: yupResolver(pricingSchema) as any,
    mode: "onChange",
    defaultValues: {
      rate: "10,000",
      rateType: "hourly",
      currency: "NGN",
    },
  });

  const { formState, setValue } = form;
  const { isValid } = formState;

  const toggleOption = (id: string) => {
    setPricingOptions((prev) =>
      prev.map((option) => ({
        ...option,
        isSelected: option.id === id,
      }))
    );
    setValue("rateType", id, { shouldValidate: true });
  };

  const updateRate = (id: string, newRate: string) => {
    setPricingOptions((prev) =>
      prev.map((option) =>
        option.id === id ? { ...option, rate: newRate } : option
      )
    );
    const selectedOption = pricingOptions.find((opt) => opt.isSelected);
    if (selectedOption && selectedOption.id === id) {
      setValue("rate", newRate, { shouldValidate: true });
    }
  };

  const updateCurrency = (id: string, newCurrency: string) => {
    setPricingOptions((prev) =>
      prev.map((option) =>
        option.id === id ? { ...option, currency: newCurrency } : option
      )
    );
    const selectedOption = pricingOptions.find((opt) => opt.isSelected);
    if (selectedOption && selectedOption.id === id) {
      setValue("currency", newCurrency, { shouldValidate: true });
    }
  };

  const handleSubmit = async () => {
    const selectedOption = pricingOptions.find((opt) => opt.isSelected);
    if (!selectedOption) return;

    // Remove commas and convert to number
    const rateAmount = Number.parseFloat(selectedOption.rate.replace(/,/g, ""));

    if (Number.isNaN(rateAmount) || rateAmount <= 0) {
      return;
    }

    try {
      await updateProfile.mutateAsync({
        pricing: {
          rate: selectedOption.id as "hourly" | "fixed" | "package",
          currency: selectedOption.currency,
          amount: rateAmount,
        },
      });
    } catch (error) {
      console.error("Failed to update pricing:", error);
    }
  };

  const getCurrencyDisplay = (currency: string) => {
    switch (currency) {
      case "NGN":
        return { flag: "🇳🇬", bgColor: "bg-green-500" };
      case "USD":
        return { flag: "🇺🇸", bgColor: "bg-blue-500" };
      case "EUR":
        return { flag: "🇪🇺", bgColor: "bg-blue-600" };
      default:
        return { flag: "🇳🇬", bgColor: "bg-green-500" };
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <div className="mx-auto mb-2 sm:mb-3 md:mb-4 flex items-center justify-center">
          <img src={logo} alt="" className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-[60px] lg:h-[60px]" />
        </div>
        <h2 className="text-black header text-xl sm:text-2xl md:text-3xl lg:text-[32px] leading-tight">
          How do you charge for your services?
        </h2>
        <p className="text-black para text-sm sm:text-base mt-2 sm:mt-3 max-w-xl mx-auto">
          Choose how you want to charge for your services. You can select one
          option.
        </p>
      </div>

      {/* services charge  */}
      <div className="w-full space-y-3 sm:space-y-4 mb-6 sm:mb-8">
        {pricingOptions.map((option) => {
          const currencyDisplay = getCurrencyDisplay(option.currency);

          return (
            <div
              key={option.id}
              onClick={() => toggleOption(option.id)}
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-lg border-2 transition-all duration-200 gap-3 sm:gap-4 touch-manipulation active:scale-[0.98] ${
                option.isSelected
                  ? "border-purple-500 bg-purple-50 shadow-sm"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300 active:bg-gray-100"
              }`}
            >
              <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0 w-full sm:w-auto">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOption(option.id);
                  }}
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 touch-manipulation ${
                    option.isSelected
                      ? "bg-purple-500 border-purple-500"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {option.isSelected && (
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white rounded-full" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 font-medium text-sm sm:text-base md:text-lg">
                    {option.title}
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1 leading-relaxed">
                    {option.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end sm:justify-start">
                <div className="flex items-center bg-white border border-gray-300 rounded-md sm:rounded-lg overflow-hidden">
                  <div
                    className={`flex items-center px-2 sm:px-3 py-2 bg-[#F4F4F4] text-black`}
                  >
                    <span className="text-base sm:text-lg mr-1 sm:mr-1.5">
                      {currencyDisplay.flag}
                    </span>
                    <select
                      value={option.currency}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateCurrency(option.id, e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-transparent text-black text-xs sm:text-sm font-medium outline-none appearance-none cursor-pointer touch-manipulation pr-6 sm:pr-8"
                    >
                      <option value="NGN" className="text-black">
                        NGN
                      </option>
                      <option value="USD" className="text-black">
                        USD
                      </option>
                      <option value="EUR" className="text-black">
                        EUR
                      </option>
                    </select>
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 ml-1 pointer-events-none absolute right-1 sm:right-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={option.rate}
                    onChange={(e) => {
                      e.stopPropagation();
                      updateRate(option.id, e.target.value);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className={`px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-medium outline-none w-20 sm:w-24 md:w-28 touch-manipulation ${
                      option.isSelected ? "text-purple-600" : "text-gray-400"
                    }`}
                    placeholder="0.0"
                  />
                  <span
                    className={`px-2 sm:px-3 text-xs sm:text-sm ${
                      option.isSelected ? "text-purple-600" : "text-gray-400"
                    }`}
                  >
                    {option.fee}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="w-full max-w-2xl space-y-3 sm:space-y-4">
        <CustomButton
          title={updateProfile.isPending ? "Saving..." : "Continue"}
          onClick={handleSubmit}
          disabled={!isValid || updateProfile.isPending}
          loading={updateProfile.isPending}
        />
         <CustomButton
            onClick={handleGoBack}
            title="Go back"
            className="goBack bg-transparent text-black "
            disabled={updateProfile.isPending}
          />
      </div>
    </div>
  );
}
