import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Bookmark } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import Modal from "@components/accessories/main-modal";
import { BankDropdown, type BankOption } from "@components/accessories/bank-dropdown";
import { SearchableDropdown } from "@components/accessories/searchable-dropdown";
import { NIGERIAN_BANKS, CURRENCIES } from "@utils/banks";
import { CustomButton } from "@components/accessories/button";
import { BuildingIconWhite } from "@components/accessories/building-icon-white";
import type { PayoutAccountData } from "./payout-setting";

interface ChangePayoutDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PayoutAccountData) => Promise<void>;
  initialData: PayoutAccountData;
}

interface PayoutAccountFormData {
  currency: string;
  accountNumber: string;
  bankName: BankOption | null;
  accountName: string;
  countryCode: string;
}

export const ChangePayoutDetailsModal: React.FC<ChangePayoutDetailsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<PayoutAccountFormData>({
    currency: initialData.currency,
    accountNumber: initialData.accountNumber,
    bankName: NIGERIAN_BANKS.find((bank) => bank.label === initialData.bankName) || null,
    accountName: initialData.accountName,
    countryCode: initialData.countryCode,
  });

  // Update form data when initialData changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        currency: initialData.currency,
        accountNumber: initialData.accountNumber,
        bankName: NIGERIAN_BANKS.find((bank) => bank.label === initialData.bankName) || null,
        accountName: initialData.accountName,
        countryCode: initialData.countryCode,
      });
    }
  }, [initialData, isOpen]);

  const selectedCurrency = CURRENCIES.find((c) => c.value === formData.currency);

  const handleAccountNumberChange = (e: ChangeEvent<HTMLInputElement>): void => {
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dataToSave: PayoutAccountData = {
        currency: formData.currency,
        accountNumber: formData.accountNumber,
        bankName: formData.bankName ? formData.bankName.label : "",
        accountName: formData.accountName,
        countryCode: formData.countryCode,
      };
      await onSave(dataToSave);
      onClose();
    } catch (error) {
      console.error("Error saving payout details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    formData.currency &&
    formData.accountNumber.trim() !== "" &&
    formData.bankName !== null &&
    formData.accountName.trim() !== "";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="xl"
      showCloseButton={false}
      closeOnOverlayClick={!isLoading}
    >
      <div className="-m-4 sm:-m-6">
        {/* Custom Header */}
        <div className="bg-[#7417c6] flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-4 sm:py-5">
          <h2 className="text-lg sm:text-xl font-medium text-white leading-tight sm:leading-[28px] tracking-[0.12px]">
            Change Bank Details
          </h2>
          <BuildingIconWhite size={20} className="sm:w-6 sm:h-6 w-5 h-5 shrink-0" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex flex-col gap-4 p-4 sm:p-6 flex-1 overflow-y-auto">
            {/* Section Title */}
            <div className="flex items-center gap-4 mb-3">
              <h3 className="text-lg sm:text-xl font-medium text-[#2d2d2d] leading-[24px] sm:leading-[28px] tracking-[0.1px]">
                Profile Information
              </h3>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
            {/* Currency Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-xs sm:text-sm font-normal text-[#5a5a5a] leading-4 sm:leading-5">
                Select Currency
              </label>
              <SearchableDropdown
                options={CURRENCIES.map((currency) => ({
                  value: currency.value,
                  label: currency.label,
                  icon: (
                    <div className="w-6 h-4 sm:w-7 sm:h-5">
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
                          <div className="w-6 h-4 sm:w-7 sm:h-5">
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
                  const currency = CURRENCIES.find((c) => c.value === option.value);
                  if (currency) {
                    setFormData((prev) => ({
                      ...prev,
                      currency: currency.value,
                      countryCode: currency.countryCode,
                    }));
                  }
                }}
                placeholder="Select currency"
                searchPlaceholder="Search"
                triggerClassName="h-12 sm:h-14 rounded-[14px] sm:rounded-[16px]"
              />
            </div>

            {/* Bank Name */}
            <div className="flex gap-3 sm:gap-[15px]">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-xs sm:text-sm font-normal text-[#5a5a5a] leading-4 sm:leading-5">
                  Bank Name
                </label>
                <BankDropdown
                  options={NIGERIAN_BANKS}
                  value={formData.bankName}
                  onChange={handleBankChange}
                  placeholder="Select bank"
                  className="h-12 sm:h-14 rounded-[14px] sm:rounded-[16px]"
                />
              </div>
            </div>

            {/* Account Number */}
            <div className="flex flex-col gap-2">
              <label className="text-xs sm:text-sm font-normal text-[#5a5a5a] leading-4 sm:leading-5">
                Bank Account Number
              </label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={handleAccountNumberChange}
                placeholder="Enter account number"
                disabled={isLoading}
                className="h-12 sm:h-14 border border-[#dfdfdf] rounded-[14px] sm:rounded-[16px] px-3 sm:px-4 text-sm sm:text-base font-medium text-[#2d2d2d] leading-5 sm:leading-6 tracking-[0.08px] focus:outline-none focus:ring-2 focus:ring-[#7417c6] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Account Name */}
            <div className="flex gap-3 sm:gap-[15px]">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-xs sm:text-sm font-normal text-[#5a5a5a] leading-4 sm:leading-5">
                  Bank Account Name
                </label>
                <input
                  type="text"
                  value={formData.accountName}
                  onChange={handleAccountNameChange}
                  placeholder="Enter account name"
                  disabled={isLoading}
                  className="h-12 sm:h-14 border border-[#dfdfdf] rounded-[14px] sm:rounded-[16px] px-3 sm:px-4 text-sm sm:text-base font-medium text-[#2d2d2d] leading-5 sm:leading-6 tracking-[0.08px] focus:outline-none focus:ring-2 focus:ring-[#7417c6] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>
          </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-[9px] items-stretch sm:items-center p-4 sm:p-6 border-t border-[#eaeaea] bg-white">
            <CustomButton
              title="Cancel"
              onClick={onClose}
              type="button"
              disabled={isLoading}
              className="flex-1 h-12 sm:h-14 px-4 sm:px-8 py-3 sm:py-4 border border-[#f1e8f9] text-[#7417c6] rounded-[10px] text-sm sm:text-base font-medium leading-5 sm:leading-6 tracking-[0.08px] bg-transparent hover:bg-[#f1e8f9] disabled:bg-transparent shadow-none transition-colors"
            />
            <CustomButton
              title="Save Changes"
              icon={<Bookmark className="w-5 h-5 sm:w-6 sm:h-6" />}
              type="submit"
              disabled={!isFormValid}
              loading={isLoading}
              className="flex-1 h-12 sm:h-14 px-4 sm:px-8 py-3 sm:py-4 rounded-[10px] text-sm sm:text-base font-medium leading-5 sm:leading-6 tracking-[0.08px] hover:bg-[#6a15b8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed [&>span:first-child]:order-2 [&>span:last-child]:order-1"
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

