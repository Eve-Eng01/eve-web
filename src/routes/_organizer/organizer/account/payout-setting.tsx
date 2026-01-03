import React, { useMemo, useCallback, memo, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { Trash2 } from "lucide-react";
import BuildingIcon from "@assets/building-icon.svg";
import { useGetPayoutAccounts, useDeletePayoutAccount } from "@/shared/api/services/payout";
import { mapPayoutAccountToFrontend } from "@/shared/utils/payout-helpers";
import DeleteConfirmationModal from "@/shared/components/accessories/delete-confirmation-modal";

export interface PayoutAccountData {
  id?: string;
  accountNumber: string;
  bankName: string;
  accountName: string;
  currency: string;
  countryCode: string;
}

interface PayoutSettingProps {
  onChangeDetails: (account: PayoutAccountData) => void;
}

interface AccountCardProps {
  account: PayoutAccountData;
  onChangeDetails: (account: PayoutAccountData) => void;
  onDelete: (accountId: string) => void;
}

const AccountCard: React.FC<AccountCardProps> = memo(({ account, onChangeDetails, onDelete }) => {
  const handleChangeDetails = useCallback(() => {
    onChangeDetails(account);
  }, [account, onChangeDetails]);

  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (account.id) {
      onDelete(account.id);
    }
  }, [account.id, onDelete]);

  if (!account.id) {
    console.warn("AccountCard: account missing id", account);
  }
  return (
    <div className="bg-[#f4f4f4] flex flex-col gap-3 sm:gap-4 items-start p-4 sm:p-5 w-full rounded-[14px] h-full relative">
      {/* Account Details Header */}
      <div className="flex gap-2 sm:gap-3 items-center justify-between w-full">
        <div className="flex gap-2 sm:gap-3 items-center">
          <h3 className="text-lg sm:text-xl font-semibold text-[#2d2d2d] leading-[24px] sm:leading-[28px] tracking-[0.1px]">
            Account details
          </h3>
          <img
            src={BuildingIcon}
            alt="Building icon"
            className="h-4 w-4 sm:h-5 sm:w-5 text-black shrink-0"
          />
        </div>
        {/* Delete Button */}
        {account.id && (
          <button
            onClick={handleDeleteClick}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
            aria-label="Delete account"
          >
            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 text-[#5a5a5a] group-hover:text-red-600 transition-colors" />
          </button>
        )}
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
        onClick={handleChangeDetails}
        className="border border-[#7417c6] flex items-center justify-center h-12 sm:h-14 px-4 sm:px-6 py-3 sm:py-4 w-full text-sm sm:text-base font-semibold text-[#7417c6] leading-[20px] sm:leading-[22px] tracking-[0.09px] hover:bg-[#7417c6] hover:text-white transition-colors rounded-[14px]"
      >
        Change Details
      </button>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memo
  return (
    prevProps.account.id === nextProps.account.id &&
    prevProps.account.accountNumber === nextProps.account.accountNumber &&
    prevProps.account.bankName === nextProps.account.bankName &&
    prevProps.account.accountName === nextProps.account.accountName &&
    prevProps.account.currency === nextProps.account.currency &&
    prevProps.account.countryCode === nextProps.account.countryCode &&
    prevProps.onDelete === nextProps.onDelete &&
    prevProps.onChangeDetails === nextProps.onChangeDetails
  );
});

AccountCard.displayName = "AccountCard";

const PayoutSetting: React.FC<PayoutSettingProps> = ({
  onChangeDetails,
}) => {
  const { data: payoutAccountsResponse, isLoading, error, refetch } = useGetPayoutAccounts();
  const deletePayoutAccountMutation = useDeletePayoutAccount();
  const [deleteAccountId, setDeleteAccountId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Memoize onChangeDetails callback to prevent unnecessary re-renders
  const handleChangeDetails = useCallback(
    (account: PayoutAccountData) => {
      onChangeDetails(account);
    },
    [onChangeDetails]
  );

  // Map API accounts to frontend format
  const accounts = useMemo(() => {
    if (!payoutAccountsResponse?.data?.accounts) return [];
    return payoutAccountsResponse.data.accounts.map(mapPayoutAccountToFrontend);
  }, [payoutAccountsResponse]);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleDeleteClick = useCallback((accountId: string) => {
    setDeleteAccountId(accountId);
    setIsDeleteModalOpen(true);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setDeleteAccountId(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteAccountId) return;
    
    try {
      await deletePayoutAccountMutation.mutateAsync(deleteAccountId);
      handleCloseDeleteModal();
      // The mutation hook will invalidate queries and refetch automatically
    } catch (error) {
      // Error is handled by the mutation hook (toast notification)
      console.error("Failed to delete payout account:", error);
    }
  }, [deleteAccountId, deletePayoutAccountMutation, handleCloseDeleteModal]);

  const accountToDelete = useMemo(() => {
    return accounts.find(acc => acc.id === deleteAccountId);
  }, [accounts, deleteAccountId]);

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center py-12 min-h-[400px]">
          <span className="loading loading-spinner text-primary w-12 h-12"></span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-red-600 mb-4">Failed to load payout accounts</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-[#7417c6] text-white rounded-lg hover:bg-[#6a15b8] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (accounts.length === 0) {
    return (
      <div className="flex flex-col gap-6 sm:gap-8 md:gap-[48px] items-start w-full">
        <div className="flex flex-col gap-2 items-start w-full">
          <h2 className="text-lg sm:text-xl font-medium text-[#2d2d2d] leading-[24px] sm:leading-[28px] tracking-[0.1px]">
            Your Payout Account
          </h2>
          <p className="text-base sm:text-lg font-normal text-[#5a5a5a] leading-[22px] sm:leading-[26px] tracking-[0.09px]">
            This is where your payouts will be sent. You can update your account
            details anytime. and please ensure all you details are correct to
            avoid being sent to another account or bank account that is not duly
            registered.
          </p>
        </div>
        <div className="w-full text-center py-12">
          <p className="text-[#5a5a5a]">No payout accounts found. Add your first payout account to get started.</p>
        </div>
      </div>
    );
  }

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
          {accounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              onChangeDetails={handleChangeDetails}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : accounts.length === 1 ? (
        <AccountCard
          account={accounts[0]}
          onChangeDetails={handleChangeDetails}
          onDelete={handleDeleteClick}
        />
      ) : null}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete payout account"
        description={
          <div className="text-base text-gray-600 mb-4">
            <p>Are you sure you want to delete this payout account?</p>
            {accountToDelete && (
              <p className="mt-2 font-medium">
                {accountToDelete.bankName} - {accountToDelete.accountNumber}
              </p>
            )}
            <p className="mt-2 text-sm text-gray-500">This action cannot be undone.</p>
          </div>
        }
        isLoading={deletePayoutAccountMutation.isPending}
      />
    </div>
  );
};

export default PayoutSetting;
