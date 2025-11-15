import React from "react";
import Modal from "./main-modal";
import { BadgeCheck } from "lucide-react";
import { CustomButton } from "./button";

interface PayoutSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToHomepage: () => void;
  amount: number;
  bankName: string;
  currency?: string;
}

const PayoutSuccessModal: React.FC<PayoutSuccessModalProps> = ({
  isOpen,
  onClose,
  onGoToHomepage,
  amount,
  bankName,
  currency = "NGN",
}) => {
  const formatCurrency = (value: number): string => {
    if (currency === "NGN") {
      return `₦${value.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`;
    }
    return `$${value.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
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
            Payout Request Submitted
          </h2>
          <p className="text-sm sm:text-base md:text-lg font-medium text-[#5a5a5a] leading-[20px] sm:leading-[24px] md:leading-[26px] tracking-[0.09px] max-w-[515px] ">
            Your payout of{" "}
            <span className="font-semibold text-[#2d2d2d]">
              {formatCurrency(amount)}
            </span>{" "}
            has been successfully requested. Funds will be processed to your{" "}
            <span className="font-semibold text-[#2d2d2d]">
              {bankName} account
            </span>{" "}
            within 24 hours.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full mt-2 sm:mt-0">
          <CustomButton
            title="Cancel"
            onClick={onClose}
            className="flex-1 h-12 sm:h-14 md:h-[70px] px-4 sm:px-8 md:px-12 py-3 sm:py-4 border-2 border-[#7417c6] bg-[#ffffff] text-[#7417c6] rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg font-medium leading-[20px] sm:leading-[24px] md:leading-[26px] tracking-[0.09px] hover:bg-[#d8d6d9] disabled:bg-[#f1e8f9] shadow-none transition-colors"
          />
          <CustomButton
            title="Go to Homepage"
            onClick={onGoToHomepage}
            className="flex-1 h-12 sm:h-14 md:h-[70px] px-4 sm:px-8 md:px-12 py-3 sm:py-4 bg-[#17b26a] text-white rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg font-semibold leading-[20px] sm:leading-[24px] md:leading-[26px] tracking-[0.09px] hover:bg-[#15a05f] disabled:bg-[#17b26a] transition-colors"
          />
        </div>
      </div>
    </Modal>
  );
};

export default PayoutSuccessModal;
