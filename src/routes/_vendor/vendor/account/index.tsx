import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type { ChangeEvent } from "react";
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
import { Toast } from "@components/accessories/toast";

export const Route = createFileRoute("/_vendor/vendor/account/")({
  component: RouteComponent,
});

export const User = {
  name: "Gabriel Emumwen",
  email: "gabrielemumwen20@gmail.com",
};

function RouteComponent() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Profile Setting");
  const [isChangeDetailsModalOpen, setIsChangeDetailsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  // Mock data for multiple payout accounts
  const [payoutAccountData, setPayoutAccountData] = useState<PayoutAccountData[]>([
    {
      id: "1",
      accountNumber: "2109019402",
      bankName: "United Bank for Africa",
      accountName: "Emumwen Gabriel Osauonamen",
      currency: "NGN",
      countryCode: "NG",
    },
    {
      id: "2",
      accountNumber: "1234567890",
      bankName: "Access Bank",
      accountName: "Emumwen Gabriel Osauonamen",
      currency: "NGN",
      countryCode: "NG",
    },
    {
      id: "3",
      accountNumber: "9876543210",
      bankName: "GTBank",
      accountName: "Emumwen Gabriel Osauonamen",
      currency: "NGN",
      countryCode: "NG",
    },
    {
      id: "4",
      accountNumber: "5555555555",
      bankName: "First Bank of Nigeria",
      accountName: "Emumwen Gabriel Osauonamen",
      currency: "NGN",
      countryCode: "NG",
    },
  ]);

  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: "Emumwen Gabriel Osauonamen",
    email: "gabrielemumwen20@gmail.com",
    companyName: "Eve Even Platform",
    location: "ibeju Lekki Lagos, Nigeria.",
    organizerNumber: "+234-081- 5882-5489",
  });

  const tabs = [
    { id: "Profile Setting", label: "Profile Setting" },
    { id: "Payout Setting", label: "Payout Setting" },
  ];

  const handleInputChange = (field: keyof ProfileFormData) => (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleGoBack = () => {
    navigate({ to: "/vendor" });
  };

  const handleSaveChanges = () => {
    // TODO: Implement save functionality
    console.log("Saving changes:", formData);
  };

  const handleAddNewPayoutAccount = () => {
    navigate({ to: "/vendor/account/add-payout-account" });
  };

  const [selectedAccount, setSelectedAccount] = useState<PayoutAccountData | null>(null);

  const handleChangeDetails = (account: PayoutAccountData) => {
    setSelectedAccount(account);
    setIsChangeDetailsModalOpen(true);
  };

  const handleSavePayoutDetails = async (data: PayoutAccountData): Promise<void> => {
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
    setShowToast(true);
  };

  return (
    <DashboardLayout isVendor user={User}>
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
            onFormDataChange={handleInputChange}
            onSaveChanges={handleSaveChanges}
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

      {/* Toast Notification */}
      <Toast
        message="Changed Saved"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        duration={3000}
      />
    </DashboardLayout>
  );
}
