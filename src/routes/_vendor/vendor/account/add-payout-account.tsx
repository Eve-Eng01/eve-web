import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, BadgeCheck, Bookmark } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import { DashboardLayout } from "@components/layouts/dashboard-layout";
import {
  BankDropdown,
  type BankOption,
} from "@components/accessories/bank-dropdown";
import { SearchableDropdown } from "@components/accessories/searchable-dropdown";
import { NIGERIAN_BANKS, CURRENCIES } from "@utils/banks";
import Modal from "@components/accessories/main-modal";
import { CustomButton } from "@components/accessories/button";
import { User } from "./index";

export const Route = createFileRoute("/_vendor/vendor/account/add-payout-account")({
  component: RouteComponent,
});

interface PayoutAccountFormData {
  currency: string;
  accountNumber: string;
  bankName: BankOption | null;
  accountName: string;
}

function RouteComponent() {
  const navigate = useNavigate();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<PayoutAccountFormData>({
    currency: "NGN",
    accountNumber: "",
    bankName: null,
    accountName: "",
  });

  const selectedCurrency = CURRENCIES.find(
    (c) => c.value === formData.currency
  );

  const handleAccountNumberChange = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    setFormData((prev) => ({
      ...prev,
      accountNumber: e.target.value,
    }));
  };

  const handleBankChange = (bank: BankOption): void => {
    setFormData((prev) => ({
      ...prev,
      bankName: bank,
    }));
  };

  const handleAccountNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData((prev) => ({
      ...prev,
      accountName: e.target.value,
    }));
  };

  const handleGoBack = (): void => {
    navigate({ to: "/vendor/account" });
  };

  const handleCancel = (): void => {
    navigate({ to: "/vendor/account" });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // TODO: Implement API call to add payout account
    console.log("Submitting payout account:", formData);
    setIsSuccessModalOpen(true);
  };

  const handleSuccessContinue = (): void => {
    setIsSuccessModalOpen(false);
    navigate({ to: "/vendor/account" });
  };

  const handleRequestVendors = (): void => {
    setIsSuccessModalOpen(false);
    navigate({ to: "/vendor" });
  };

  const isFormValid =
    formData.currency &&
    formData.accountNumber.trim() !== "" &&
    formData.bankName !== null &&
    formData.accountName.trim() !== "";

  return (
    <DashboardLayout isVendor user={User}>
      <div className="bg-white">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <CustomButton
            title="Go back"
            icon={<ArrowLeft className="h-4 w-4" />}
            onClick={handleGoBack}
            className="w-auto flex items-center justify-center gap-2 px-3 py-3.5 border border-[#eaeaea] rounded-[14px] text-sm font-medium text-[#777777] bg-transparent hover:bg-gray-50 disabled:bg-transparent shadow-none transition-colors"
          />
          <h1 className="text-lg sm:text-xl font-medium text-[#2d2d2d] leading-[24px] sm:leading-[28px] tracking-[0.1px]">
            Add New Payout Account
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            {/* Currency Selector */}
            <SearchableDropdown
              label="Select Currency"
              options={CURRENCIES.map((currency) => ({
                value: currency.value,
                label: currency.label,
                icon: (
                  <div className="w-7 h-5">
                    <ReactCountryFlag
                      countryCode={currency.countryCode}
                      svg
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </div>
                ),
              }))}
              value={
                selectedCurrency
                  ? {
                      value: selectedCurrency.value,
                      label: selectedCurrency.label,
                      icon: (
                        <div className="w-7 h-5">
                          <ReactCountryFlag
                            countryCode={selectedCurrency.countryCode}
                            svg
                            style={{
                              width: "100%",
                              height: "100%",
                            }}
                          />
                        </div>
                      ),
                    }
                  : null
              }
              onChange={(option) => {
                const currency = CURRENCIES.find(
                  (c) => c.value === option.value
                );
                if (currency) {
                  setFormData((prev) => ({
                    ...prev,
                    currency: currency.value,
                  }));
                }
              }}
              placeholder="Select currency"
              searchPlaceholder="Search"
            />

            {/* Account Number */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-normal text-[#5a5a5a] leading-5">
                Bank Account Number
              </label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={handleAccountNumberChange}
                placeholder="Enter account number"
                className="h-14 border border-[#dfdfdf] rounded-[14px] px-4 sm:px-[18px] text-sm sm:text-base font-medium text-[#2d2d2d] leading-6 tracking-[0.08px] focus:outline-none focus:ring-2 focus:ring-[#7417c6] focus:border-transparent"
              />
            </div>

            {/* Bank Name */}
            <BankDropdown
              label="Bank Name"
              options={NIGERIAN_BANKS}
              value={formData.bankName}
              onChange={handleBankChange}
              placeholder="Select bank"
            />

            {/* Account Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-normal text-[#5a5a5a] leading-5">
                Bank Account Name
              </label>
              <input
                type="text"
                value={formData.accountName}
                onChange={handleAccountNameChange}
                placeholder="Enter account name"
                className="h-14 border border-[#dfdfdf] rounded-[14px] px-4 sm:px-[18px] text-sm sm:text-base font-medium text-[#2d2d2d] leading-6 tracking-[0.08px] focus:outline-none focus:ring-2 focus:ring-[#7417c6] focus:border-transparent"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end mt-6 sm:mt-8">
            <CustomButton
              title="Cancel"
              onClick={handleCancel}
              type="button"
              className="h-14 px-6 sm:px-12 py-3 sm:py-4 border-2 border-[#7417c6] text-[#7417c6] rounded-[14px] text-base sm:text-lg font-semibold leading-[22px] sm:leading-[26px] tracking-[0.09px] bg-transparent hover:bg-[#f1e8f9] disabled:bg-transparent shadow-none transition-colors w-full sm:w-auto"
            />
            <CustomButton
              title="Save"
              icon={<Bookmark className="w-4 h-4" />}
              type="submit"
              disabled={!isFormValid}
              className="h-14  px-6 sm:px-12 py-3 sm:py-4 rounded-[14px] text-base sm:text-lg font-semibold leading-[22px] sm:leading-[26px] tracking-[0.09px] hover:bg-[#6a15b8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto [&>span:first-child]:order-2 [&>span:last-child]:order-1"
            />
          </div>
        </form>

        {/* Success Modal */}
        <Modal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          title=""
          size="xl"
          showCloseButton={false}
          closeOnOverlayClick={false}
        >
          <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 items-center py-4 sm:py-6 md:py-8 px-2 sm:px-4">
            {/* Success Icon */}
            <div className="bg-[#ddf5eb] rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center shadow-lg flex-shrink-0">
              <BadgeCheck className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[#17b26a]" />
            </div>

            {/* Success Message */}
            <div className="flex flex-col gap-1.5 sm:gap-2 items-center text-center">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-[#2d2d2d] leading-tight sm:leading-[28px] md:leading-[32px] lg:leading-[40px] px-2">
                You've successfully added new account
              </h2>
              <p className="text-sm sm:text-base md:text-lg font-medium text-[#5a5a5a] leading-[20px] sm:leading-[24px] md:leading-[26px] tracking-[0.09px] max-w-[515px] px-2">
                Your new payout account has been added and verified. You can now
                receive your payments directly to this account.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full mt-2 sm:mt-0">
              <CustomButton
                title="Request Vendors"
                onClick={handleRequestVendors}
                className="flex-1 h-12 sm:h-14 md:h-[70px] px-4 sm:px-8 md:px-12 py-3 sm:py-4 border-2 border-[#7417c6] bg-[#f1e8f9] text-[#7417c6] rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg font-medium leading-[20px] sm:leading-[24px] md:leading-[26px] tracking-[0.09px] hover:bg-[#e8d5f3] disabled:bg-[#f1e8f9] shadow-none transition-colors"
              />
              <CustomButton
                title="Continue"
                onClick={handleSuccessContinue}
                className="flex-1 h-12 sm:h-14 md:h-[70px] px-4 sm:px-8 md:px-12 py-3 sm:py-4 bg-[#17b26a] text-white rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg font-semibold leading-[20px] sm:leading-[24px] md:leading-[26px] tracking-[0.09px] hover:bg-[#15a05f] disabled:bg-[#17b26a] transition-colors"
              />
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
