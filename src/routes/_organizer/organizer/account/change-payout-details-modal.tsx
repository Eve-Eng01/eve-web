import { useEffect, useMemo } from "react";
import { Bookmark } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Modal from "@components/accessories/main-modal";
import { BankDropdown } from "@components/accessories/bank-dropdown";
import { SearchableDropdown } from "@components/accessories/searchable-dropdown";
import { NIGERIAN_BANKS, CURRENCIES } from "@utils/banks";
import { CustomButton } from "@components/accessories/button";
import { BuildingIconWhite } from "@components/accessories/building-icon-white";
import type { PayoutAccountData } from "./payout-setting";
import { useUpdatePayoutAccount } from "@/shared/api/services/payout";
import { payoutAccountSchema, type PayoutAccountFormData } from "@/shared/forms/schemas/payout.schema";
import { FormInput } from "@/shared/forms/components/FormInput";

interface ChangePayoutDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: PayoutAccountData;
}

export const ChangePayoutDetailsModal: React.FC<ChangePayoutDetailsModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const updatePayoutAccountMutation = useUpdatePayoutAccount();

  const form = useForm<PayoutAccountFormData>({
    resolver: yupResolver(payoutAccountSchema) as any,
    mode: "onChange",
    defaultValues: {
      currency: initialData.currency,
      accountNumber: initialData.accountNumber,
      bankName: initialData.bankName,
      accountName: initialData.accountName,
      countryCode: initialData.countryCode || "",
    },
  });

  const { register, handleSubmit, formState, setValue, watch, reset } = form;
  const { errors, isSubmitting, isValid } = formState;

  const currency = watch("currency");
  const bankName = watch("bankName");

  const selectedCurrency = useMemo(
    () => CURRENCIES.find((c) => c.value === currency),
    [currency]
  );

  const selectedBankOption = useMemo(() => {
    return NIGERIAN_BANKS.find((bank) => bank.label === bankName) || null;
  }, [bankName]);

  // Update form data when initialData or modal opens
  useEffect(() => {
    if (isOpen) {
      reset({
        currency: initialData.currency,
        accountNumber: initialData.accountNumber,
        bankName: initialData.bankName,
        accountName: initialData.accountName,
        countryCode: initialData.countryCode,
      });
    }
  }, [initialData, isOpen, reset]);

  const onSubmit = async (data: PayoutAccountFormData): Promise<void> => {
    if (!initialData.id) {
      return;
    }

    try {
      await updatePayoutAccountMutation.mutateAsync({
        payoutId: initialData.id,
        data: {
          bankName: data.bankName,
          accountNumber: data.accountNumber.trim(),
          accountHolderName: data.accountName.trim(),
        },
      });
      
      onClose();
    } catch (error) {
      // Error is handled by the mutation hook (toast notification)
      console.error("Error updating payout details:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="xl"
      showCloseButton={false}
      closeOnOverlayClick={!updatePayoutAccountMutation.isPending}
    >
      <div className="-m-4 sm:-m-6">
        {/* Custom Header */}
        <div className="bg-[#7417c6] flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-4 sm:py-5">
          <h2 className="text-lg sm:text-xl font-medium text-white leading-tight sm:leading-[28px] tracking-[0.12px]">
            Change Bank Details
          </h2>
          <BuildingIconWhite size={20} className="sm:w-6 sm:h-6 w-5 h-5 shrink-0" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
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
                onChange={() => {
                  // Currency cannot be changed for existing accounts - changes are not saved
                }}
                placeholder="Select currency"
                searchPlaceholder="Search"
                triggerClassName="h-12 sm:h-14 rounded-[14px] sm:rounded-[16px] opacity-60 cursor-not-allowed"
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
                  value={selectedBankOption}
                  onChange={(bank) => {
                    setValue("bankName", bank.label, { shouldValidate: true });
                  }}
                  placeholder="Select bank"
                  className="h-12 sm:h-14 rounded-[14px] sm:rounded-[16px]"
                />
                {errors.bankName && (
                  <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.bankName.message}</p>
                )}
              </div>
            </div>

            {/* Account Number */}
            <FormInput
              name="accountNumber"
              label="Bank Account Number"
              placeholder="Enter account number"
              register={register}
              error={errors.accountNumber}
              disabled={updatePayoutAccountMutation.isPending}
              inputClassName="h-12 sm:h-14 rounded-[14px] sm:rounded-[16px] px-3 sm:px-4 text-sm sm:text-base font-medium text-[#2d2d2d] leading-5 sm:leading-6 tracking-[0.08px]"
              labelClassName="text-xs sm:text-sm font-normal text-[#5a5a5a] leading-4 sm:leading-5"
            />

            {/* Account Name */}
            <div className="flex gap-3 sm:gap-[15px]">
              <div className="flex-1 flex flex-col gap-2">
                <FormInput
                  name="accountName"
                  label="Bank Account Name"
                  placeholder="Enter account name"
                  register={register}
                  error={errors.accountName}
                  disabled={updatePayoutAccountMutation.isPending}
                  inputClassName="h-12 sm:h-14 rounded-[14px] sm:rounded-[16px] px-3 sm:px-4 text-sm sm:text-base font-medium text-[#2d2d2d] leading-5 sm:leading-6 tracking-[0.08px]"
                  labelClassName="text-xs sm:text-sm font-normal text-[#5a5a5a] leading-4 sm:leading-5"
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
              disabled={updatePayoutAccountMutation.isPending}
              className="flex-1 h-12 sm:h-14 px-4 sm:px-8 py-3 sm:py-4 border border-[#f1e8f9] text-[#7417c6] rounded-[10px] text-sm sm:text-base font-medium leading-5 sm:leading-6 tracking-[0.08px] bg-transparent hover:bg-[#f1e8f9] disabled:bg-transparent shadow-none transition-colors"
            />
            <CustomButton
              title="Save Changes"
              icon={<Bookmark className="w-5 h-5 sm:w-6 sm:h-6" />}
              type="submit"
              disabled={!isValid || isSubmitting || updatePayoutAccountMutation.isPending || !initialData.id}
              loading={isSubmitting || updatePayoutAccountMutation.isPending}
              className="flex-1 h-12 sm:h-14 px-4 sm:px-8 py-3 sm:py-4 rounded-[10px] text-sm sm:text-base font-medium leading-5 sm:leading-6 tracking-[0.08px] hover:bg-[#6a15b8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed [&>span:first-child]:order-2 [&>span:last-child]:order-1"
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};
