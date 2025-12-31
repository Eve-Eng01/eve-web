import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo, useCallback } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { DashboardLayout } from "@components/layouts/dashboard-layout";
import TabSwitch from "@components/accessories/tab-switch";
import ProfileSetting, {
  type ProfileFormData,
} from "./profile-setting";
import PayoutSetting, {
  type PayoutAccountData,
} from "./payout-setting";
import { ChangePayoutDetailsModal } from "./change-payout-details-modal";
import { useAuthStore } from "@/shared/stores/auth-store";
import { useToastStore } from "@/shared/stores/toast-store";
import { type DropdownOption } from "@components/accessories/dropdown-input";
import countries from "world-countries";
import { useGetUser } from "@/shared/api/services/auth/auth.hooks";
import { useUpdateOnboardingProfile } from "@/shared/api/services/onboarding";

export const Route = createFileRoute("/_organizer/organizer/account/")({
  component: RouteComponent,
});

export function RouteComponent() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Profile Setting");
  const [isChangeDetailsModalOpen, setIsChangeDetailsModalOpen] = useState(false);
  const showToast = useToastStore((state) => state.showToast);
  
  // Get user from auth store
  const user = useAuthStore((state) => state.user);
  const userName = user ? `${user.firstName} ${user.lastname}`.trim() : "User";
  const userNameForPayout = user ? `${user.firstName} ${user.lastname}`.trim() : "";

  // API hooks
  const updateProfileMutation = useUpdateOnboardingProfile({
    autoNavigate: false, // Don't navigate away from the page
  });
  const { data: userProfileData, refetch: refetchUser } = useGetUser();

  // Memoize country options (only compute once)
  const countryOptions = useMemo(() => {
    return countries.map((country) => ({
      value: country.cca2,
      label: country.name.common,
    }));
  }, []);

  const [payoutAccountData, setPayoutAccountData] = useState<PayoutAccountData[]>([
    {
      id: "1",
      accountNumber: "2109019402",
      bankName: "United Bank for Africa",
      accountName: userNameForPayout || "User",
      currency: "NGN",
      countryCode: "NG",
    },
    {
      id: "2",
      accountNumber: "1234567890",
      bankName: "Access Bank",
      accountName: userNameForPayout || "User",
      currency: "NGN",
      countryCode: "NG",
    },
    {
      id: "3",
      accountNumber: "9876543210",
      bankName: "GTBank",
      accountName: userNameForPayout || "User",
      currency: "NGN",
      countryCode: "NG",
    },
    {
      id: "4",
      accountNumber: "5555555555",
      bankName: "First Bank of Nigeria",
      accountName: userNameForPayout || "User",
      currency: "NGN",
      countryCode: "NG",
    },
  ]);

  // Initialize form data from API response
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: userName,
    email: user?.email || "",
    companyName: "",
    country: "",
    phone: undefined,
    location: "",
    links: [],
    profilePictureUrl: undefined,
    isVerified: false,
  });

  // Update form data when user profile is fetched
  useEffect(() => {
    if (userProfileData?.status && userProfileData?.data?.profile) {
      const profile = userProfileData.data.profile;
      const organizerData = profile.is_onboarded?.id as any; // Type assertion for organizer profile

      setFormData({
        fullName: `${profile.first_name} ${profile.last_name}`.trim(),
        email: profile.email,
        companyName: organizerData?.organization_name || "",
        country: organizerData?.country || "",
        phone: organizerData?.phone ? {
          countryCode: organizerData.phone.countryCode,
          number: organizerData.phone.number,
        } : undefined,
        location: organizerData?.location || "",
        links: organizerData?.links?.map((link: any, index: number) => ({
          id: index.toString(),
          brand: link.brand || link.platform,
          url: link.url,
        })) || [],
        profilePictureUrl: profile.avatar || undefined,
        isVerified: organizerData?.is_verified || false,
      });
    }
  }, [userProfileData]);

  const tabs = [
    { id: "Profile Setting", label: "Profile Setting" },
    { id: "Payout Setting", label: "Payout Setting" },
  ];

  const handleFormDataChange = useCallback((field: keyof ProfileFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleGoBack = useCallback(() => {
    navigate({ to: "/organizer" });
  }, [navigate]);

  const handleSaveChanges = useCallback(async () => {
    try {
      // Prepare data for API using correct field names for PATCH /onboarding
      const updateData = {
        company_name: formData.companyName,
        country: formData.country,
        phone: formData.phone,
        location: formData.location,
        links: formData.links?.map(link => ({
          brand: link.brand,
          url: link.url,
        })),
        completed: false, // Don't navigate away, just update
      };

      await updateProfileMutation.mutateAsync(updateData);
      
      // Refetch user profile after successful update
      await refetchUser();
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  }, [formData, updateProfileMutation, refetchUser]);

  const handleAddNewPayoutAccount = useCallback(() => {
    navigate({ to: "/organizer/account/add-payout-account" });
  }, [navigate]);

  const [selectedAccount, setSelectedAccount] = useState<PayoutAccountData | null>(null);

  const handleChangeDetails = useCallback((account: PayoutAccountData) => {
    setSelectedAccount(account);
    setIsChangeDetailsModalOpen(true);
  }, []);

  const handleSavePayoutDetails = useCallback(async (data: PayoutAccountData): Promise<void> => {
    // Simulate API call with delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Update the specific account in the array
    setPayoutAccountData((prev) =>
      prev.map((account) =>
        account.id === data.id || account.id === selectedAccount?.id
          ? { ...data, id: account.id }
          : account
      )
    );
    
    setIsChangeDetailsModalOpen(false);
    setSelectedAccount(null);
    showToast("Payout details updated successfully", "success");
  }, [selectedAccount, showToast]);

  return (
    <DashboardLayout>
      <div className="bg-white">
        {/* Go Back Button and Add New Payout Account Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 mb-6 sm:mb-8">
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center gap-2 px-3 py-3.5 border border-[#eaeaea] rounded-[14px] text-sm font-medium text-[#777777] hover:bg-gray-50 transition-colors w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </button>
          {activeTab === "Payout Setting" && (
            <button
              onClick={handleAddNewPayoutAccount}
              className="flex items-center justify-center gap-1 bg-[#7417c6] text-white px-4 py-3 sm:py-4 rounded-[10px] text-sm sm:text-base font-medium leading-6 tracking-[0.08px] hover:bg-[#6a15b8] transition-colors w-full sm:w-auto"
            >
              <span className="whitespace-nowrap">Add New Payout Account</span>
              <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          )}
        </div>

        {/* Tab Switcher */}
        <TabSwitch
          tabs={tabs.map((tab) =>
            tab.id === "Payout Setting" && activeTab === "Payout Setting"
              ? { id: tab.id, label: "Payout" }
              : tab
          )}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          containerClassName="bg-[#f4f4f4] p-1 rounded-2xl mb-6 sm:mb-8 inline-flex gap-2 w-full sm:w-auto"
          tabClassName="px-3 py-2 sm:py-3 rounded-[14px] text-xs sm:text-sm font-medium border flex-1 sm:flex-none"
          activeTabClassName="bg-white text-[#7417c6] border-[#d5b9ee]"
          inactiveTabClassName="text-[#777777] border-[#dfdfdf] hover:bg-gray-50 bg-transparent"
        />

        {/* Content */}
        {activeTab === "Profile Setting" ? (
          <ProfileSetting
            formData={formData}
            onFormDataChange={handleFormDataChange}
            onSaveChanges={handleSaveChanges}
            countryOptions={countryOptions}
            onProfileUpdate={refetchUser}
          />
        ) : (
          <PayoutSetting
            payoutAccountData={payoutAccountData}
            onChangeDetails={handleChangeDetails}
          />
        )}
      </div>

      {/* Change Payout Details Modal */}
      {selectedAccount && (
        <ChangePayoutDetailsModal
          isOpen={isChangeDetailsModalOpen}
          onClose={() => {
            setIsChangeDetailsModalOpen(false);
            setSelectedAccount(null);
          }}
          onSave={handleSavePayoutDetails}
          initialData={selectedAccount}
        />
      )}

    </DashboardLayout>
  );
}
