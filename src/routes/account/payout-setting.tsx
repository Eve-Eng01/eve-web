import React from "react";
import ReactCountryFlag from "react-country-flag";
import BuildingIcon from "@assets/building-icon.svg";

export interface PayoutAccountData {
  id?: string;
  accountNumber: string;
  bankName: string;
  accountName: string;
  currency: string;
  countryCode: string;
}

interface PayoutSettingProps {
  payoutAccountData: PayoutAccountData | PayoutAccountData[];
  onChangeDetails: (account: PayoutAccountData) => void;
}

interface AccountCardProps {
  account: PayoutAccountData;
  onChangeDetails: (account: PayoutAccountData) => void;
}

const AccountCard: React.FC<AccountCardProps> = ({ account, onChangeDetails }) => {
  return (
    <div className="bg-[#f4f4f4] flex flex-col gap-3 sm:gap-4 items-start p-4 sm:p-5 w-full rounded-[14px] h-full">
      {/* Account Details Header */}
      <div className="flex gap-2 sm:gap-3 items-center w-full">
        <h3 className="text-lg sm:text-xl font-semibold text-[#2d2d2d] leading-[24px] sm:leading-[28px] tracking-[0.1px]">
          Account details
        </h3>
        <img
          src={BuildingIcon}
          alt="Building icon"
          className="h-4 w-4 sm:h-5 sm:w-5 text-black shrink-0"
        />
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-[#eaeaea]" />

      {/* Account Number */}
      <div className="bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 p-3 sm:p-[14px] w-full rounded-[14px]">
        <p className="text-sm sm:text-base font-normal text-[#5a5a5a] leading-[20px] sm:leading-[22px] tracking-[0.09px]">
          Account Number
        </p>
        <p className="text-sm sm:text-base font-medium text-[#2d2d2d] leading-[20px] sm:leading-[22px] tracking-[0.09px] break-all sm:break-normal">
          {account.accountNumber}
        </p>
      </div>

      {/* Bank Name */}
      <div className="bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 p-3 sm:p-[14px] w-full rounded-[14px]">
        <p className="text-sm sm:text-base font-normal text-[#5a5a5a] leading-[20px] sm:leading-[22px] tracking-[0.09px]">
          Bank Name
        </p>
        <p className="text-sm sm:text-base font-medium text-[#2d2d2d] leading-[20px] sm:leading-[22px] tracking-[0.09px] break-words sm:break-normal">
          {account.bankName}
        </p>
      </div>

      {/* Bank Account Name */}
      <div className="bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 p-3 sm:p-[14px] w-full rounded-[14px]">
        <p className="text-sm sm:text-base font-normal text-[#5a5a5a] leading-[20px] sm:leading-[22px] tracking-[0.09px]">
          Account Name
        </p>
        <p className="text-sm sm:text-base font-medium text-[#2d2d2d] leading-[20px] sm:leading-[22px] tracking-[0.09px] break-words sm:break-normal">
          {account.accountName}
        </p>
      </div>

      {/* Currency */}
      <div className="bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 p-3 sm:p-[14px] w-full rounded-[14px]">
        <p className="text-sm sm:text-base font-normal text-[#5a5a5a] leading-[20px] sm:leading-[22px] tracking-[0.09px]">
          Currency
        </p>
        <div className="bg-[#f4f4f4] flex gap-1 p-1 rounded-[4px] w-fit">
          <div className="w-6 h-[18px] sm:w-[28px] sm:h-[20px]">
            <ReactCountryFlag
              countryCode={account.countryCode}
              svg
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "4px",
              }}
            />
          </div>
          <p className="text-sm sm:text-base font-medium text-[#2d2d2d] leading-[20px] sm:leading-[22px] tracking-[0.09px]">
            {account.currency}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-[#eaeaea]" />

      {/* Change Details Button */}
      <button
        onClick={() => onChangeDetails(account)}
        className="border border-[#7417c6] flex items-center justify-center h-12 sm:h-14 px-4 sm:px-6 py-3 sm:py-4 w-full text-sm sm:text-base font-semibold text-[#7417c6] leading-[20px] sm:leading-[22px] tracking-[0.09px] hover:bg-[#7417c6] hover:text-white transition-colors rounded-[14px]"
      >
        Change Details
      </button>
    </div>
  );
};

const PayoutSetting: React.FC<PayoutSettingProps> = ({
  payoutAccountData,
  onChangeDetails,
}) => {
  // Convert single account to array for consistent handling
  const accounts = Array.isArray(payoutAccountData)
    ? payoutAccountData
    : [payoutAccountData];

  return (
    <div className="flex flex-col gap-6 sm:gap-8 md:gap-[48px] items-start w-full">
      {/* Payout Account Section */}
      <div className="flex flex-col gap-2 items-start w-full">
        <h2 className="text-lg sm:text-xl font-medium text-[#2d2d2d] leading-[24px] sm:leading-[28px] tracking-[0.1px]">
          Your Payout {accounts.length > 1 ? "Accounts" : "Account"}
        </h2>
        <p className="text-base sm:text-lg font-normal text-[#5a5a5a] leading-[22px] sm:leading-[26px] tracking-[0.09px]">
          This is where your payouts will be sent. You can update your account
          details anytime. and please ensure all you details are correct to
          avoid being sent to another account or bank account that is not duly
          registered.
        </p>
      </div>

      {/* Accounts Grid */}
      {accounts.length > 1 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
          {accounts.map((account, index) => (
            <AccountCard
              key={account.id || `account-${index}`}
              account={account}
              onChangeDetails={onChangeDetails}
            />
          ))}
        </div>
      ) : (
        <AccountCard
          account={accounts[0]}
          onChangeDetails={onChangeDetails}
        />
      )}
    </div>
  );
};

export default PayoutSetting;
