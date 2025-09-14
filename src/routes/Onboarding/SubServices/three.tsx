import { createFileRoute } from "@tanstack/react-router";
import { ServiceOneProps } from "./one";
import { CustomButton } from "../../Accessories/Button";
import logo from "../../../assets/evaLogo.png";
import { useState } from "react";

export const Route = createFileRoute("/Onboarding/SubServices/three")({
  component: ServiceThree,
});

interface PricingOption {
  id: string;
  title: string;
  description: string;
  isSelected: boolean;
  rate: string;
  currency: string;
}

export function ServiceThree({continue: handleContinue, back: handleGoBack}: ServiceOneProps) {
  const [pricingOptions, setPricingOptions] = useState<PricingOption[]>([
    {
      id: 'hourly',
      title: 'Hourly Rate',
      description: 'Charge clients based on time spent working.',
      isSelected: true,
      rate: '10,000',
      currency: 'NGN'
    },
    {
      id: 'minimum',
      title: 'Minimum Project Fee',
      description: 'The minimum amount you\'re willing to accept.',
      isSelected: false,
      rate: '0.0',
      currency: 'NGN'
    },
    {
      id: 'package',
      title: 'Package Pricing',
      description: 'Offer services as fixed-price packages.',
      isSelected: false,
      rate: '0.0',
      currency: 'NGN'
    }
  ]);

  const toggleOption = (id: string) => {
    setPricingOptions(prev => 
      prev.map(option => ({
        ...option,
        isSelected: option.id === id
      }))
    );
  };

  const updateRate = (id: string, newRate: string) => {
    setPricingOptions(prev => 
      prev.map(option => 
        option.id === id 
          ? { ...option, rate: newRate }
          : option
      )
    );
  };

  const updateCurrency = (id: string, newCurrency: string) => {
    setPricingOptions(prev => 
      prev.map(option => 
        option.id === id 
          ? { ...option, currency: newCurrency }
          : option
      )
    );
  };

  const getCurrencyDisplay = (currency: string) => {
    switch (currency) {
      case 'NGN':
        return { flag: '🇳🇬', bgColor: 'bg-green-500' };
      case 'USD':
        return { flag: '🇺🇸', bgColor: 'bg-blue-500' };
      case 'EUR':
        return { flag: '🇪🇺', bgColor: 'bg-blue-600' };
      default:
        return { flag: '🇳🇬', bgColor: 'bg-green-500' };
    }
  };

  return (
    <div className="min-h-screen flex bg-white justify-center items-center">
      <div className="flex flex-col justify-center items-center px-4">
        <div className="mx-auto mb-4">
          <img src={logo} alt="" className="w-[60px] h-[60px]" />
        </div>
        <h2 className="text-black header">How do you charge for your services?</h2>
        <p className="text-black para">
          Choose how you want to charge for your services. You can select one option.
        </p>

        {/* services charge  */}
        <div className="w-full space-y-3 mb-8">
          {pricingOptions.map((option) => {
            const currencyDisplay = getCurrencyDisplay(option.currency);
            
            return (
              <div
                key={option.id}
                onClick={() => toggleOption(option.id)}
                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200 ${
                  option.isSelected
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleOption(option.id)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      option.isSelected
                        ? 'bg-purple-500 border-purple-500'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    {option.isSelected && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </button>
                  <div>
                    <h3 className="text-gray-900 font-medium text-sm">
                      {option.title}
                    </h3>
                    <p className="text-gray-500 text-xs mt-1">
                      {option.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center bg-white border border-gray-300 rounded-md overflow-hidden">
                    <div className={`flex items-center px-3 py-2 ${currencyDisplay.bgColor} text-white`}>
                      <span className="text-white mr-1">{currencyDisplay.flag}</span>
                      <select
                        value={option.currency}
                        onChange={(e) => updateCurrency(option.id, e.target.value)}
                        className="bg-transparent text-white text-sm font-medium outline-none appearance-none cursor-pointer"
                      >
                        <option value="NGN" className="text-black">NGN</option>
                        <option value="USD" className="text-black">USD</option>
                        <option value="EUR" className="text-black">EUR</option>
                      </select>
                      <svg
                        className="w-3 h-3 ml-1"
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
                      readOnly
                      value={option.rate}
                      onChange={(e) => updateRate(option.id, e.target.value)}
                      className={`px-3 py-2 text-right text-sm font-medium outline-none w-24 ${
                        option.isSelected ? 'text-purple-600' : 'text-gray-400'
                      }`}
                      placeholder="0.0"
                    />
                    <span className={`px-2 text-sm ${
                      option.isSelected ? 'text-purple-600' : 'text-gray-400'
                    }`}>
                      / hr
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-full max-w-md otherbtn">
          <CustomButton title="Continue" onClick={handleContinue}/>
          <button onClick={handleGoBack} className="goBack">
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}