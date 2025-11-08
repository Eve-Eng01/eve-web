import React from "react";
import { Building2 } from "lucide-react";
import ReactCountryFlag from "react-country-flag";

export interface PayoutAccountData {
  accountNumber: string;
  bankName: string;
  accountName: string;
  currency: string;
  countryCode: string;
}

interface PayoutSettingProps {
  payoutAccountData: PayoutAccountData;
  onChangeDetails: () => void;
}

const PayoutSetting: React.FC<PayoutSettingProps> = ({
  payoutAccountData,
  onChangeDetails,
}) => {
  return (
    <div className="flex flex-col gap-6 sm:gap-8 md:gap-[48px] items-start w-full">
      {/* Payout Account Section */}
      <div className="flex flex-col gap-2 items-start w-full">
        <h2 className="text-lg sm:text-xl font-medium text-[#2d2d2d] leading-[24px] sm:leading-[28px] tracking-[0.1px]">
          Your Payout Account
        </h2>
        <p className="text-base sm:text-lg font-normal text-[#5a5a5a] leading-[22px] sm:leading-[26px] tracking-[0.09px]">
          This is where your payouts will be sent. You can update your account
          details anytime. and please ensure all you details are correct to avoid
          being sent to another account or bank account that is not duly
          registered.
        </p>
      </div>

      {/* Account Details Card */}
      <div className="bg-[#f4f4f4] flex flex-col gap-3 sm:gap-4 items-start p-4 sm:p-5 w-full rounded-[14px]">
        {/* Account Details Header */}
        <div className="flex gap-2 sm:gap-3 items-center w-full">
          <h3 className="text-lg sm:text-xl font-semibold text-[#2d2d2d] leading-[24px] sm:leading-[28px] tracking-[0.1px]">
            Account details
          </h3>
          <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-black shrink-0" />
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-[#eaeaea]" />

        {/* Account Number */}
        <div className="bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 p-3 sm:p-[14px] w-full rounded-[14px]">
          <p className="text-base sm:text-lg font-normal text-[#5a5a5a] leading-[22px] sm:leading-[26px] tracking-[0.09px]">
            Account Number
          </p>
          <p className="text-base sm:text-lg font-medium text-[#2d2d2d] leading-[22px] sm:leading-[26px] tracking-[0.09px] break-all sm:break-normal">
            {payoutAccountData.accountNumber}
          </p>
        </div>

        {/* Bank Name */}
        <div className="bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 p-3 sm:p-[14px] w-full rounded-[14px]">
          <p className="text-base sm:text-lg font-normal text-[#5a5a5a] leading-[22px] sm:leading-[26px] tracking-[0.09px]">
            Bank Name
          </p>
          <p className="text-base sm:text-lg font-medium text-[#2d2d2d] leading-[22px] sm:leading-[26px] tracking-[0.09px] break-words sm:break-normal">
            {payoutAccountData.bankName}
          </p>
        </div>

        {/* Bank Account Name */}
        <div className="bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 p-3 sm:p-[14px] w-full rounded-[14px]">
          <p className="text-base sm:text-lg font-normal text-[#5a5a5a] leading-[22px] sm:leading-[26px] tracking-[0.09px]">
            Bank Account Name
          </p>
          <p className="text-base sm:text-lg font-medium text-[#2d2d2d] leading-[22px] sm:leading-[26px] tracking-[0.09px] break-words sm:break-normal">
            {payoutAccountData.accountName}
          </p>
        </div>

        {/* Currency */}
        <div className="bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 p-3 sm:p-[14px] w-full rounded-[14px]">
          <p className="text-base sm:text-lg font-normal text-[#5a5a5a] leading-[22px] sm:leading-[26px] tracking-[0.09px]">
            Currency
          </p>
          <div className="bg-[#f4f4f4] flex items-center gap-1 p-1 rounded-[4px] w-fit">
            <div className="w-6 h-[18px] sm:w-[28px] sm:h-[20px]">
              <ReactCountryFlag
                countryCode={payoutAccountData.countryCode}
                svg
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
            <p className="text-base sm:text-lg font-medium text-[#2d2d2d] leading-[22px] sm:leading-[26px] tracking-[0.09px]">
              {payoutAccountData.currency}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-[#eaeaea]" />

        {/* Change Details Button */}
        <button
          onClick={onChangeDetails}
          className="border border-[#7417c6] flex items-center justify-center h-12 sm:h-14 px-6 sm:px-12 py-3 sm:py-4 w-full text-base sm:text-lg font-semibold text-[#7417c6] leading-[22px] sm:leading-[26px] tracking-[0.09px] hover:bg-[#7417c6] hover:text-white transition-colors rounded-[14px]"
        >
          Change Details
        </button>
      </div>
    </div>
  );
};

export default PayoutSetting;

