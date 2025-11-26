import React, { useState, useMemo } from "react";
import Modal from "./main-modal";
import { SearchableDropdown, type DropdownOption } from "./searchable-dropdown";
import type { PayoutAccountData } from "@routes/account/payout-setting";
import { cn } from "@utils/classnames";

interface RequestPayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  payoutAccounts: PayoutAccountData[];
  availableBalance?: number;
  onContinue: (data: {
    amount: number;
    account: PayoutAccountData;
    transferFee: number;
    totalAmount: number;
  }) => void;
}

interface BreakdownItemProps {
  label: string;
  value: string;
}

const BreakdownItem: React.FC<BreakdownItemProps> = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between w-full">
      <p className="font-['Poppins',sans-serif] font-normal text-[0.875rem] leading-[1.25rem] text-[#777777]">
        {label}
      </p>
      <p className="font-['Poppins',sans-serif] font-medium text-[1rem] leading-[1.5rem] tracking-[0.005rem] text-[#2d2d2d]">
        {value}
      </p>
    </div>
  );
};

const RequestPayoutModal: React.FC<RequestPayoutModalProps> = ({
  isOpen,
  onClose,
  payoutAccounts,
  availableBalance = 120000,
  onContinue,
}) => {
  const [amount, setAmount] = useState<string>("");
  const [selectedAccount, setSelectedAccount] = useState<DropdownOption | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Convert payout accounts to dropdown options
  const accountOptions: DropdownOption[] = useMemo(() => {
    return payoutAccounts.map((account) => ({
      value: account.id || account.accountNumber,
      label: `${account.bankName} - (${account.accountNumber})`,
      icon: account.bankName,
    }));
  }, [payoutAccounts]);

  // Calculate fees and totals
  const calculations = useMemo(() => {
    const numericAmount = parseFloat(amount.replace(/[^0-9.]/g, "")) || 0;
    
    // Processing fee calculation - fixed $200 as per design
    const processingFee = 200;
    
    // Amount user will receive (withdrawal amount minus processing fee)
    const amountToReceive = numericAmount - processingFee;

    return {
      withdrawalAmount: numericAmount,
      processingFee,
      amountToReceive: amountToReceive > 0 ? amountToReceive : 0,
    };
  }, [amount]);

  const formatCurrency = (value: number): string => {
    return `$${value.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const isFormValid = useMemo(() => {
    return amount && calculations.withdrawalAmount > 0 && selectedAccount !== null;
  }, [amount, calculations.withdrawalAmount, selectedAccount]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const inputValue = e.target.value;
    // Remove all non-numeric characters except decimal point
    const numericValue = inputValue.replace(/[^0-9.]/g, "");
    
    // Allow only one decimal point
    const parts = numericValue.split(".");
    if (parts.length > 2) {
      return;
    }
    
    // Format with $ prefix and comma separators
    if (numericValue === "") {
      setAmount("");
      setError("");
    } else {
      const num = parseFloat(numericValue);
      if (!isNaN(num)) {
        setAmount(`$${num.toLocaleString("en-US", { maximumFractionDigits: 0 })}`);
      } else {
        setAmount(`$${numericValue}`);
      }
      setError("");
    }
  };

  const handleAccountChange = (option: DropdownOption): void => {
    setSelectedAccount(option);
    setError("");
  };

  const handleConfirm = async (): Promise<void> => {
    if (!isFormValid || isLoading) {
      return;
    }

    // Find the selected account data
    const accountData = payoutAccounts.find(
      (acc) => (acc.id || acc.accountNumber) === selectedAccount?.value
    );

    if (!accountData) {
      setError("Selected account not found");
      return;
    }

    // Set loading state
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Call the continue handler with the data
      onContinue({
        amount: calculations.withdrawalAmount,
        account: accountData,
        transferFee: calculations.processingFee,
        totalAmount: calculations.withdrawalAmount,
      });
    } catch (error) {
      console.error("Error processing payout:", error);
      setError("Failed to process payout. Please try again.");
      setIsLoading(false);
    }
  };

  const handleClose = (): void => {
    if (isLoading) return; // Prevent closing during loading
    setAmount("");
    setSelectedAccount(null);
    setError("");
    setIsLoading(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      size="xl"
      showCloseButton={false}
      closeOnOverlayClick={!isLoading}
      animationDuration={300}
    >
      <div className="flex flex-col gap-[1.25rem] items-center justify-center p-[1rem] w-full">
        {/* Header */}
        <div className="flex flex-col gap-[0.5rem] items-center text-center w-full">
          <h2 className="font-['Poppins',sans-serif] font-medium text-[1.75rem] leading-[2.125rem] text-[#2d2d2d] w-full">
            Request Payout
          </h2>
          <p className="font-['Poppins',sans-serif] font-normal text-[1rem] leading-[1.375rem] tracking-[0.0075rem] text-[#5a5a5a] w-full">
            Enter the amount you'd like to withdraw and choose your preferred payout account.
          </p>
        </div>

        {/* Amount Input */}
        <div className="flex flex-col gap-[0.5rem] items-start w-full">
          <label className="font-['Poppins',sans-serif] font-normal text-[0.875rem] leading-[1.25rem] text-[#5a5a5a]">
            Enter Payout Amount
          </label>
          <div className="border border-[#dfdfdf] h-[3rem] rounded-[0.875rem] w-full relative">
            <input
              type="text"
              placeholder="$0"
              value={amount}
              onChange={handleAmountChange}
              className="w-full h-full px-[1.125rem] font-['Poppins',sans-serif] font-semibold text-[1.5rem] leading-[2rem] tracking-[0.0075rem] text-[#2d2d2d] bg-transparent border-0 rounded-[0.875rem] focus:outline-none focus:ring-2 focus:ring-[#7417c6]"
            />
          </div>
          {error && amount === "" && (
            <p className="text-[0.875rem] text-red-500 mt-[0.25rem]">{error}</p>
          )}
        </div>

        {/* Account Selector */}
        <div className="flex flex-col gap-[0.5rem] items-start w-full">
          <label className="font-['Poppins',sans-serif] font-normal text-[0.875rem] leading-[1.25rem] text-[#5a5a5a]">
            Select Payout Account
          </label>
          <div className="w-full">
            <SearchableDropdown
              label=""
              options={accountOptions}
              value={selectedAccount}
              onChange={handleAccountChange}
              placeholder="Select payout account"
              searchPlaceholder="Search accounts..."
              className="w-full"
              triggerClassName="h-[3rem] px-[0.6875rem]"
              renderTrigger={(option) => {
                const account = payoutAccounts.find(
                  (acc) => (acc.id || acc.accountNumber) === option.value
                );
                if (!account) return <span>{option.label}</span>;
                return (
                  <div className="flex items-center gap-[1rem] flex-1 min-w-0">
                    <div className="w-[1.625rem] h-[1.625rem] rounded-full bg-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                      <span className="text-[0.75rem] font-medium text-gray-600">
                        {account.bankName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex items-center gap-[0.5rem] flex-1 min-w-0">
                      <span className="font-['Poppins',sans-serif] font-medium text-[1rem] leading-[1.5rem] tracking-[0.005rem] text-[#2d2d2d]">
                        {account.bankName} - ({account.accountNumber})
                      </span>
                      <div className="w-[0.5rem] h-[0.5rem] rounded-full bg-[#2d2d2d] shrink-0" />
                      <span className="font-['Poppins',sans-serif] font-medium text-[1.125rem] leading-[1.625rem] tracking-[0.005625rem] text-[#2d2d2d]">
                        {account.accountName}
                      </span>
                    </div>
                  </div>
                );
              }}
              renderOption={(option) => {
                const account = payoutAccounts.find(
                  (acc) => (acc.id || acc.accountNumber) === option.value
                );
                return (
                  <div className="flex items-center gap-[1rem] flex-1 min-w-0">
                    {account && (
                      <>
                        <div className="w-[1.625rem] h-[1.625rem] rounded-full bg-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                          <span className="text-[0.75rem] font-medium text-gray-600">
                            {account.bankName.charAt(0)}
                          </span>
                        </div>
                        <div className="flex items-center gap-[0.5rem] flex-1 min-w-0">
                          <span className="font-['Poppins',sans-serif] font-medium text-[1rem] leading-[1.5rem] tracking-[0.005rem] text-[#2d2d2d]">
                            {account.bankName} - ({account.accountNumber})
                          </span>
                          <div className="w-[0.5rem] h-[0.5rem] rounded-full bg-[#2d2d2d] shrink-0" />
                          <span className="font-['Poppins',sans-serif] font-medium text-[1.125rem] leading-[1.625rem] tracking-[0.005625rem] text-[#2d2d2d]">
                            {account.accountName}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                );
              }}
            />
          </div>
          {error && !selectedAccount && (
            <p className="text-[0.875rem] text-red-500 mt-[0.25rem]">{error}</p>
          )}
        </div>

        {/* Summary Section */}
        <div className="flex flex-col gap-[0.75rem] items-start w-full">
          <label className="font-['Poppins',sans-serif] font-normal text-[0.875rem] leading-[1.25rem] text-[#5a5a5a]">
            Summary Section
          </label>
          <div className="h-[0.0625rem] w-full bg-[#eaeaea]" />
          <div className="flex flex-col gap-[0.75rem] w-full">
            <BreakdownItem
              label="Available Balance:"
              value={formatCurrency(availableBalance)}
            />
            <BreakdownItem
              label="Processing Fee:"
              value={formatCurrency(calculations.processingFee)}
            />
            <BreakdownItem
              label="You'll Receive:"
              value={formatCurrency(calculations.amountToReceive)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-[0.75rem] items-stretch sm:items-center w-full">
          <button
            onClick={handleClose}
            className="w-full sm:flex-1 h-[3rem] px-[1.5rem] py-[0.75rem] bg-transparent border border-[#dfdfdf] rounded-[1rem] font-['Poppins',sans-serif] font-medium text-[1rem] leading-[1.5rem] tracking-[0.005625rem] text-[#2d2d2d] transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isFormValid || isLoading}
            className={cn(
              "w-full sm:flex-1 h-[3rem] px-[1.5rem] py-[0.75rem] bg-[#7417c6] rounded-[1rem] font-['Poppins',sans-serif] font-medium text-[1rem] leading-[1.5rem] tracking-[0.005625rem] text-white transition-colors relative",
              (!isFormValid || isLoading) && "opacity-50 cursor-not-allowed",
              isFormValid && !isLoading && "hover:bg-[#5f12a0]"
            )}
          >
            {isLoading && (
              <svg
                className="animate-spin h-5 w-5 text-white absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            <span className={isLoading ? "opacity-0" : ""}>Confirm Payout</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RequestPayoutModal;

