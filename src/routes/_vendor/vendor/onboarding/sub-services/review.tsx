import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CustomButton } from "@components/button/button";
import logo from "@assets/evaLogo.png";
import bottom from "@assets/onBoarding/bottom.png";
import { Edit, Trash2, ChevronRight, Plus, Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import Modal from "@components/accessories/main-modal";
import { UploadFormComponent } from "@components/accessories/upload-form-component";
import { useAuthStore } from "@/shared/stores/auth-store";
import { CustomPhoneInput, type PhoneData } from "@components/accessories/custom-phone-input";
import { type DropdownOption } from "@components/accessories/dropdown-input";
import { DropdownInput } from "@components/accessories/dropdown-input";
import { getCountriesOptions } from "../profile";
import { useUpdateOnboardingProfile } from "@/shared/api/services/onboarding";

export interface VendorReviewProps {
  continue: () => void;
  back: () => void;
  formData: {
    companyName: string;
    country: DropdownOption | null;
    phoneData: PhoneData | undefined;
    location: string;
    businessType: string | null;
  };
}

interface ProfileData {
  fullName: string;
  email: string;
  companyName: string;
  businessType: string;
  location: string;
  vendorNumber: string;
  availability: string;
  hourlyRate: string;
  portfolioItems: Array<{
    id: number;
    title: string;
    images: number;
    size: string;
  }>;
  socialLinks: Array<{
    id: number;
    platform: string;
    url: string;
  }>;
}

export function VendorReview({
  continue: handleContinue,
  back: handleGoBack,
  formData,
}: VendorReviewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  // State for editable data
  const [editableData, setEditableData] = useState({
    companyName: formData.companyName,
    location: formData.location,
    country: formData.country,
    phoneData: formData.phoneData,
    businessType: formData.businessType,
  });

  const [countriesOptions, setCountriesOptions] = useState<DropdownOption[]>([]);
  const [businessTypes] = useState<DropdownOption[]>([
    { value: "catering", label: "Catering/Baking" },
    { value: "videography", label: "Videographers" },
    { value: "photography", label: "Photographers" },
    { value: "music", label: "Musicians & DJs" },
    { value: "security", label: "Security Service" },
  ]);

  // Load countries on mount
  useEffect(() => {
    const countriesList = getCountriesOptions();
    setCountriesOptions(countriesList);
  }, []);

  // State for profile data (additional vendor-specific fields)
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: `${user?.firstName || ""} ${user?.lastname || ""}`.trim() || "User",
    email: user?.email || "",
    companyName: formData.companyName,
    businessType: formData.businessType || "Catering",
    location: formData.location,
    vendorNumber: formData.phoneData ? `${formData.phoneData.country.dial_code}-${formData.phoneData.phoneNumber}` : "+234-081- 5882-5489",
    availability: "40hrs a week",
    hourlyRate: "10,000 / hr",
    portfolioItems: [
      {
        id: 1,
        title: "Wedding Setup at Lekki Gardens",
        images: 6,
        size: "19.3MB",
      },
      {
        id: 2,
        title: "Wedding Setup at Lekki Gardens",
        images: 6,
        size: "19.3MB",
      },
      {
        id: 3,
        title: "Wedding Setup at Lekki Gardens",
        images: 6,
        size: "19.3MB",
      },
    ],
    socialLinks: [
      {
        id: 1,
        platform: "Instagram",
        url: "https://example.com/yourportfolio",
      },
      {
        id: 2,
        platform: "Instagram",
        url: "https://example.com/yourportfolio",
      },
    ],
  });

  // State to track which fields are being edited
  const [editingFields, setEditingFields] = useState<{
    [key: string]: boolean;
  }>({});

  // State to store temporary values during editing
  const [tempValues, setTempValues] = useState<{ [key: string]: string }>({});

  // Function to start editing a field
  const startEditing = (fieldName: string) => {
    setEditingFields((prev) => ({ ...prev, [fieldName]: true }));
    setTempValues((prev) => ({
      ...prev,
      [fieldName]: profileData[fieldName as keyof ProfileData] as string,
    }));
  };

  // Function to save changes
  const saveField = (fieldName: string) => {
    setProfileData((prev) => ({
      ...prev,
      [fieldName]: tempValues[fieldName],
    }));
    setEditingFields((prev) => ({ ...prev, [fieldName]: false }));
    setTempValues((prev) => {
      const newTemp = { ...prev };
      delete newTemp[fieldName];
      return newTemp;
    });
  };

  // Function to cancel editing
  const cancelEditing = (fieldName: string) => {
    setEditingFields((prev) => ({ ...prev, [fieldName]: false }));
    setTempValues((prev) => {
      const newTemp = { ...prev };
      delete newTemp[fieldName];
      return newTemp;
    });
  };

  // Function to handle input changes
  const handleInputChange = (fieldName: string, value: string) => {
    setTempValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  // Handle input change for editable data
  const handleEditableInputChange = (field: "companyName" | "location", value: string) => {
    setEditableData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle country change
  const handleCountryChange = (option: DropdownOption | null) => {
    setEditableData((prev) => ({ ...prev, country: option }));
  };

  // Handle phone change
  const handlePhoneChange = (phoneData: {
    country: { dial_code: string; code: string; name: string; flag: string };
    phoneNumber: string;
  }) => {
    setEditableData((prev) => ({ ...prev, phoneData }));
  };

  // Handle business type change
  const handleBusinessTypeChange = (option: DropdownOption | null) => {
    setEditableData((prev) => ({
      ...prev,
      businessType: option?.value || null,
    }));
  };

  // Get business type option from value
  const getBusinessTypeOption = (): DropdownOption | null => {
    if (!editableData.businessType) return null;
    return (
      businessTypes.find((bt) => bt.value === editableData.businessType) || null
    );
  };

  // API mutation hook - this will mark the onboarding as completed
  const updateProfile = useUpdateOnboardingProfile({
    onSuccess: () => {
      // Navigate to success page after completion
      handleContinue();
    },
    autoNavigate: true, // Automatically navigate to success page
  });

  // Handle submit - Send final data with completed flag
  const handleSubmit = async () => {
    try {
      // Prepare the final submission data
      const finalData: any = {
        completed: true, // Mark onboarding as completed
      };

      // Include any editable data that might have been changed
      if (editableData.companyName !== formData.companyName) {
        finalData.company_name = editableData.companyName;
      }

      if (editableData.location !== formData.location) {
        finalData.location = editableData.location;
      }

      if (editableData.country && editableData.country.label !== formData.country?.label) {
        finalData.country = editableData.country.label;
      }

      if (editableData.phoneData && editableData.phoneData !== formData.phoneData) {
        finalData.phone = {
          countryCode: editableData.phoneData.country.dial_code,
          number: editableData.phoneData.phoneNumber,
        };
      }

      if (editableData.businessType && editableData.businessType !== formData.businessType) {
        finalData.business_type = editableData.businessType;
      }

      // Submit the final data
      await updateProfile.mutateAsync(finalData);
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    }
  };

  const handleFormSubmit = (formData: {
    title: string;
    description: string;
    externalLink: string;
    images: File[];
  }) => {
    const { title, images } = formData;
    if (images.length === 0) return;

    const totalSizeInMB = (
      images.reduce((acc, file) => acc + file.size, 0) /
      (1024 * 1024)
    ).toFixed(2);

    const newItem = {
      id: profileData.portfolioItems.length + 1,
      title: title || "Untitled Project",
      images: images.length,
      size: `${totalSizeInMB}MB`,
    };

    setProfileData((prev) => ({
      ...prev,
      portfolioItems: [...prev.portfolioItems, newItem],
    }));
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <div className="mx-auto mb-2 sm:mb-3 md:mb-4 flex items-center justify-center">
            <img src={logo} alt="" className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-[60px] lg:h-[60px]" />
          </div>
          <h2 className="text-black header text-xl sm:text-2xl md:text-3xl lg:text-[32px] leading-tight">
            Review Your Information
          </h2>
          <p className="text-black para text-sm sm:text-base mt-2 sm:mt-3 max-w-xl mx-auto">
            Here's a summary of everything you've added. Make sure your
            details are correct before submitting your profile.
          </p>
        </div>

        {/* review */}
        <div className="w-full max-w-2xl mx-auto h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] overflow-y-auto bg-white pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <div className="space-y-4 sm:space-y-6">
                {/* Profile Information */}
                <div className="bg-white">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <div className="text-gray-600 text-sm sm:text-base">✱</div>
                    <h3 className="text-base sm:text-lg md:text-xl font-medium text-gray-900">
                      Profile Information
                    </h3>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {/* Full Name (from user - readonly) */}
                    {user?.firstName && (
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={`${user.firstName} ${user.lastname || ""}`.trim()}
                            readOnly
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg sm:rounded-xl text-gray-900 font-medium bg-gray-50"
                          />
                        </div>
                      </div>
                    )}

                    {/* Email Address (from user - readonly) */}
                    {user?.email && (
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            value={user.email}
                            readOnly
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg sm:rounded-xl text-gray-900 font-medium bg-gray-50"
                          />
                        </div>
                      </div>
                    )}

                    {/* Registered Company Name - Editable */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                        Registered Company Name
                      </label>
                      <div className="relative">
                        <input
                          id="review-company-name"
                          type="text"
                          value={editableData.companyName}
                          onChange={(e) => handleEditableInputChange("companyName", e.target.value)}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg sm:rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10 sm:pr-12 bg-white"
                          placeholder="Enter company name"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const el = document.getElementById("review-company-name");
                            if (el instanceof HTMLInputElement) el.focus();
                          }}
                          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-purple-600 hover:text-purple-700 active:text-purple-800 touch-manipulation p-1"
                          aria-label="Edit company name"
                        >
                          <Edit size={16} sm:size={18} color="#7417C6" />
                        </button>
                      </div>
                    </div>

                    {/* Business Type - Editable */}
                    <div>
                      <DropdownInput
                        className=""
                        label="Business Type"
                        options={businessTypes}
                        value={getBusinessTypeOption()}
                        onChange={handleBusinessTypeChange}
                        placeholder="Select business type"
                        searchable={true}
                      />
                    </div>

                    {/* Country - Editable */}
                    <div>
                      <DropdownInput
                        className=""
                        label="Country"
                        options={countriesOptions}
                        value={editableData.country}
                        onChange={handleCountryChange}
                        placeholder="Select your Country"
                        searchable={true}
                      />
                    </div>

                    {/* Location - Editable */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                        Location
                      </label>
                      <div className="relative">
                        <input
                          id="review-location"
                          type="text"
                          value={editableData.location}
                          onChange={(e) => handleEditableInputChange("location", e.target.value)}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg sm:rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10 sm:pr-12 bg-white"
                          placeholder="Enter location"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const el = document.getElementById("review-location");
                            if (el instanceof HTMLInputElement) el.focus();
                          }}
                          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-purple-600 hover:text-purple-700 active:text-purple-800 touch-manipulation p-1"
                          aria-label="Edit location"
                        >
                          <Edit size={16} sm:size={18} color="#7417C6" />
                        </button>
                      </div>
                    </div>

                    {/* Phone Number - Editable */}
                    <div>
                      <CustomPhoneInput
                        label="Phone Number"
                        value={editableData.phoneData}
                        onChange={handlePhoneChange}
                      />
                    </div>

                  </div>
                </div>

                {/* Availability */}
                <div className="bg-white">
                  <h3 className="text-base sm:text-lg md:text-xl font-medium text-gray-900 mb-3 sm:mb-4">
                    Your Availability
                  </h3>
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 border rounded-lg sm:rounded-xl">
                    {editingFields.availability ? (
                      <div className="flex items-center gap-2 flex-1 w-full">
                        <input
                          type="text"
                          value={tempValues.availability || ""}
                          onChange={(e) =>
                            handleInputChange("availability", e.target.value)
                          }
                          className="flex-1 bg-white border rounded-lg sm:rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          autoFocus
                        />
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => saveField("availability")}
                            className="text-green-600 hover:text-green-700 active:text-green-800 transition-colors touch-manipulation"
                          >
                            <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                          <button
                            onClick={() => cancelEditing("availability")}
                            className="text-red-600 hover:text-red-700 active:text-red-800 transition-colors touch-manipulation"
                          >
                            <X className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span className="text-gray-900 text-sm sm:text-base flex-1">
                          {profileData.availability}
                        </span>
                        <button
                          onClick={() => startEditing("availability")}
                          className="text-purple-600 hover:text-purple-700 active:text-purple-800 transition-colors touch-manipulation p-1"
                        >
                          <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* My Portfolio */}
                <div className="bg-white">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2">
                      <div className="text-gray-600 text-sm sm:text-base">✱</div>
                      <h3 className="text-base sm:text-lg md:text-xl font-medium text-gray-900">
                        My Portfolio
                      </h3>
                    </div>
                    <div
                      className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 rounded-full flex items-center justify-center cursor-pointer transition-colors touch-manipulation"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    {profileData.portfolioItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 border rounded-lg sm:rounded-xl gap-3"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-blue-400 rounded"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                              {item.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-600">
                              You've uploaded {item.images} image • {item.size}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-gray-400 hover:text-red-500 active:text-red-600 transition-colors touch-manipulation">
                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                          <button className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-gray-400 hover:text-gray-600 active:text-gray-700 transition-colors touch-manipulation">
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-white">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2">
                      <div className="text-gray-600 text-sm sm:text-base">✱</div>
                      <h3 className="text-base sm:text-lg md:text-xl font-medium text-gray-900">
                        How you charge for your services
                      </h3>
                    </div>
                    <button
                      onClick={() => startEditing("hourlyRate")}
                      className="text-purple-600 hover:text-purple-700 active:text-purple-800 transition-colors touch-manipulation p-1"
                    >
                      <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 md:p-5 bg-gray-50 border rounded-lg sm:rounded-xl gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-purple-600 rounded flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white rounded-full"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                          Hourly Rate
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Charge clients based on time spent working.
                        </p>
                      </div>
                    </div>
                    <div className="px-3 sm:px-4 py-2 border-2 border-purple-600 rounded-lg sm:rounded-xl w-full sm:w-auto">
                      {editingFields.hourlyRate ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={tempValues.hourlyRate || ""}
                            onChange={(e) =>
                              handleInputChange("hourlyRate", e.target.value)
                            }
                            className="flex-1 sm:flex-none sm:w-20 bg-white border rounded px-2 py-1.5 text-sm sm:text-base text-purple-600 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                            autoFocus
                          />
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => saveField("hourlyRate")}
                              className="text-green-600 hover:text-green-700 active:text-green-800 transition-colors touch-manipulation"
                            >
                              <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <button
                              onClick={() => cancelEditing("hourlyRate")}
                              className="text-red-600 hover:text-red-700 active:text-red-800 transition-colors touch-manipulation"
                            >
                              <X className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span className="text-purple-600 font-medium text-sm sm:text-base">
                          {profileData.hourlyRate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="bg-white">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2">
                      <div className="text-gray-600 text-sm sm:text-base">✱</div>
                      <h3 className="text-base sm:text-lg md:text-xl font-medium text-gray-900">
                        Portfolio/Social Media links
                      </h3>
                    </div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 rounded-full flex items-center justify-center cursor-pointer transition-colors touch-manipulation">
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    {profileData.socialLinks.map((link) => (
                      <div
                        key={link.id}
                        className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 border rounded-lg sm:rounded-xl gap-3"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                              {link.platform}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-600 truncate">{link.url}</p>
                          </div>
                        </div>
                        <button className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-gray-400 hover:text-red-500 active:text-red-600 transition-colors touch-manipulation flex-shrink-0">
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full max-w-2xl space-y-3 sm:space-y-4 mt-6 sm:mt-8 md:mt-10">
              <CustomButton
                title={updateProfile.isPending ? "Completing Setup..." : "Complete Setup"}
                onClick={handleSubmit}
                disabled={updateProfile.isPending}
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
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload Your Image"
        size="lg"
        animationDuration={400}
        className="max-w-2xl"
      >
        <UploadFormComponent onSubmit={handleFormSubmit} />
      </Modal>
    </>
  );
}

function RouteComponent() {
  const navigate = useNavigate();

  // This is a standalone route - formData would need to come from state
  // For now, provide default values
  const defaultFormData = {
    companyName: "",
    businessType: null,
    country: null,
    phoneData: undefined,
    location: "",
  };

  return (
    <VendorReview
      continue={() => navigate({ to: "/status/success" })}
      back={() => navigate({ to: "/vendor/onboarding/profile" })}
      formData={defaultFormData}
    />
  );
}

export const Route = createFileRoute(
  "/_vendor/vendor/onboarding/sub-services/review"
)({
  component: RouteComponent,
});
