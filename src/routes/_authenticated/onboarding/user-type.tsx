import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import logo from "@assets/evaLogo.png";
import { CustomButton } from "@components/accessories/button";
import { DecorativeBottomImage } from "@components/accessories/decorative-bottom-image";
import "./onboard.css";
import { TickCircle } from "iconsax-reactjs";
import { UserTypeCardProps, userTypes } from "@/dummy-data/data";
import { useSetRole } from "@/shared/api/services/auth";
import { UserRoleEnum } from "@/shared/api/services/auth/types";
import { useAuthStore } from "@/shared/stores/auth-store";

const UserTypeCard: React.FC<UserTypeCardProps> = ({
  userType,
  isSelected,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        w-full
        p-3
        sm:p-4
        md:p-5
        rounded-xl
        sm:rounded-2xl
        border-2
        cursor-pointer
        transition-all
        duration-200
        flex
        items-center
        justify-between
        mb-3
        sm:mb-4
        ${isSelected ? "border-[#7417C6] bg-purple-50" : "border-gray-200 bg-white hover:border-gray-300"}
      `}
    >
      <div className="flex-1 pr-2 sm:pr-4">
        <h3
          className={`
          text-base
          sm:text-lg
          md:text-xl
          font-medium
          ${isSelected ? "text-[#7417C6]" : "text-gray-800"}
        `}
        >
          {userType.title}
        </h3>
        {userType.description && (
          <p
            className={`
            text-xs
            sm:text-sm
            md:text-base
            mt-1
            sm:mt-2
            ${isSelected ? "text-purple-600" : "text-gray-600"}
          `}
          >
            {userType.description}
          </p>
        )}
      </div>

      {/* Check icon */}
      <div className="flex-shrink-0">
        <TickCircle
          color={isSelected ? "#7417C6" : "#D5D5D5"}
          variant="Outline"
          size="24"
        />
      </div>
    </div>
  );
};

export const Route = createFileRoute("/_authenticated/onboarding/user-type")({
  component: RouteComponent,
});

export function RouteComponent() {
  const user = useAuthStore((state) => state.user);

  // Map user role from store to UserRoleEnum
  const getInitialRole = (userRole?: string): UserRoleEnum | "" => {
    if (!userRole) return "";

    // Map role string to UserRoleEnum
    if (userRole === "event-organizer") {
      return UserRoleEnum.EVENT_ORGANIZER;
    }
    if (userRole === "vendor") {
      return UserRoleEnum.VENDOR;
    }

    return "";
  };

  const [selectedType, setSelectedType] = useState<UserRoleEnum | "">(() =>
    getInitialRole(user?.role)
  );
  const setRoleMutation = useSetRole();

  // Update selectedType when user role changes
  useEffect(() => {
    const initialRole = getInitialRole(user?.role);
    if (initialRole) {
      setSelectedType(initialRole);
    }
  }, [user?.role]);

  const handleContinue = async () => {
    if (!selectedType) return;

    try {
      await setRoleMutation.mutateAsync({
        role: selectedType as UserRoleEnum,
      });
      // Navigation is handled in the hook's onSuccess
    } catch (error) {
      // Error is handled in the hook's onError
      console.error("Failed to set role:", error);
    }
  };

  return (
    <div className="min-h-screen flex bg-white justify-center items-center relative overflow-hidden">
      <div className="flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 w-full max-w-2xl mx-auto py-8 sm:py-12 md:py-16">
        <div className="mx-auto mb-4 sm:mb-6 md:mb-8">
          <img
            src={logo}
            alt=""
            className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] md:w-[70px] md:h-[70px]"
          />
        </div>
        <h2 className="text-black header text-center px-4">
          How are you going to use Eve?
        </h2>
        <p className="text-black para text-center px-4">
          Tell Us Who You Are, Choose one to get the most relevant features and
          recommendations.
        </p>

        {/* User type selector */}
        <div className="w-full max-w-md space-y-0 mb-6 sm:mb-8 md:mb-10 px-2 sm:px-0">
          {userTypes.map((userType) => (
            <UserTypeCard
              key={userType.id}
              userType={userType}
              isSelected={selectedType === userType.id}
              onClick={() => setSelectedType(userType.id)}
            />
          ))}
        </div>

        <div className="w-full max-w-md px-2 sm:px-0">
          <CustomButton
            title="Continue"
            onClick={handleContinue}
            disabled={selectedType === "" || setRoleMutation.isPending}
            loading={setRoleMutation.isPending}
          />
        </div>
      </div>

      <DecorativeBottomImage />
    </div>
  );
}
