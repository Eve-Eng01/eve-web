import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react';
import logo from "../../assets/evaLogo.png";
import bottom from "../../assets/onBoarding/bottom.png";
import { CustomPhoneInput, DropdownOption } from './Services';
import { InputField } from '../Accessories/InputFIeld';
import { DropdownInput } from '../Accessories/DropdownInput';
import { CustomButton } from '../Accessories/Button';
import countries from 'world-countries';
import { VendorTwo } from './VendorSubservice/Two';
import { VendorThree } from './VendorSubservice/Three';

export const Route = createFileRoute('/Onboarding/ServiceVendor')({
  component: RouteComponent,
})
interface FormData {
    companyName: string;
    businessType: DropdownOption | null;
    country: DropdownOption | null; // Add this line
    phoneData: any; // Replace with proper phone data type
    location: string;
  }

  export const getCountriesOptions = (): DropdownOption[] => {
    return countries
      .map(country => ({
        value: country.cca2, // ISO 3166-1 alpha-2 code (e.g., "US", "NG")
        label: country.name.common,
        flag: country.flag, // Common country name (e.g., "United States", "Nigeria")
      }))
      .sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically
  };

export function RouteComponent() {
    const [currentTab, setCurrentTab] = useState(1);
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
      companyName: "Eve Even Platform",
      businessType: null,
      country: null, // Add country to form data
      phoneData: undefined,
      location: "Ibeju Lekki Lagos, Nigeria.",
    });
  
    // Replace businessTypes with countries
    const [countries, setCountries] = useState<DropdownOption[]>([]);
    const [businessTypes, setBusinessTypes] = useState<DropdownOption[]>([
      { value: "catering", label: "Catering/Baking" },
      { value: "videography", label: "Videographers" },
      { value: "photography", label: "Photographers" },
      { value: "music", label: "Musicians & DJs" },
      { value: "security", label: "Security Service" },
    ]);

    // Load countries on component mount
    useEffect(() => {
      const countriesOptions = getCountriesOptions();
      setCountries(countriesOptions);
      
      // Optional: Set Nigeria as default since your form shows Nigerian location
      const nigeria = countriesOptions.find(country => country.value === 'NG');
      if (nigeria) {
        setFormData(prev => ({ ...prev, country: nigeria }));
      }
    }, []);
  
    const handleAddNewBusinessType = (newOption: DropdownOption) => {
      setBusinessTypes([...businessTypes, newOption]);
    };

    const handleAddNewCountry = (newOption: DropdownOption) => {
      setCountries([...countries, newOption]);
    };
  
    const handleContinue = () => {
      if (currentTab < 3) {
        setCurrentTab(currentTab + 1);
      } else{
        navigate({ to: "/Accessories/SuccessPage" });
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
            <div className=" mx-auto">
              <div className="text-center mb-8">
                <div className="mx-auto mb-4 flex items-center justify-center">
                  <img src={logo} alt="" className="w-[60px] h-[60px]" />
                </div>
                <h2 className="text-black header">Let's Get Your Organization Set Up</h2>
                <p className="text-black para">
                Start by sharing a few details about your event planning company.
                </p>
              </div>
  
              <InputField
                label="Enter Registered Company Name"
                placeholder="Eve Even Platform"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              />
  
              <DropdownInput
                label="Select your Country"
                options={countries} // Use countries instead of businessTypes
                value={formData.country} // Use country instead of businessType
                onChange={(option) => setFormData({ ...formData, country: option })}
                placeholder="Select your Country"
                searchable={true}
                addNewOption={true}
                onAddNew={handleAddNewCountry}
              />
  
              <CustomPhoneInput
                label="Event Organizer Number"
                value={formData.phoneData}
                onChange={(data) => setFormData({ ...formData, phoneData: data })}
              />
  
              <InputField
                label="Location"
                placeholder="Ibeju Lekki Lagos, Nigeria."
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
  
              <div className="space-y-4 bottom">
                <CustomButton disabled={
                  formData.companyName && 
                  formData.country && // Update validation to use country
                  formData.phoneData && 
                  formData.location === "" ? true : false} 
                  title="Continue" onClick={handleContinue}
                />
              </div>
            </div>
          );
  
        case 2:
          return <VendorTwo continue={handleContinue} back={handleGoBack}/>;
        case 3:
          return <VendorThree continue={handleContinue} back={handleGoBack}/>
        default:
          return null;
      }
    };
  
    const renderProgressBar = () => {
      return (
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {[1, 2, 3].map((tab) => (
              <div
                key={tab}
                className={`w-12 h-1 rounded-full transition-colors ${
                  tab <= currentTab ? "bg-purple-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      );
    };
  
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center pt-[40px]">
        <div className="w-full max-w-2xl">
          {renderProgressBar()}
          {renderTabContent()}
        </div>
        {/* Decorative elements on the bottom side */}
        <div className="overflow-hidden pointer-events-none">
          <div className="">
            <img src={bottom} alt="" className="w-full img" />
          </div>
        </div>
      </div>
    );
  }