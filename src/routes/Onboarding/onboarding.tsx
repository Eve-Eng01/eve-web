import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useState } from "react";
import logo from "../../assets/evaLogo.png";
import bottom from "../../assets/onBoarding/bottom.png";
import { CustomButton } from "../Accessories/Button";
import "./onboard.css";
import { TickCircle } from "iconsax-reactjs";
import { UserTypeCardProps, userTypes } from "../../DummyData/data";

const UserTypeCard: React.FC<UserTypeCardProps> = ({ userType, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        w-full
        p-4
        rounded-2xl
        border-2
        cursor-pointer
        transition-all
        duration-200
        flex
        items-center
        justify-between
        mb-4
        ${isSelected ? "border-[#7417C6] bg-purple-50" : "border-gray-200 bg-white hover:border-gray-300"}
      `}
    >
      <div className="flex-1">
        <h3
          className={`
          text-lg
          font-medium
          ${isSelected ? "text-[#7417C6]" : "text-gray-800"}
        `}
        >
          {userType.title}
        </h3>
        {userType.description && (
          <p
            className={`
            text-sm
            mt-1
            ${isSelected ? "text-purple-600" : "text-gray-600"}
          `}
          >
            {userType.description}
          </p>
        )}
      </div>

      {/* Check icon */}
      <div>
        <TickCircle color={isSelected ? "#7417C6" : "#D5D5D5"} variant="Outline" />
      </div>
    </div>
  );
};

export const Route = createFileRoute("/Onboarding/onboarding")({
  component: RouteComponent,
});

export function RouteComponent() {
  const [selectedType, setSelectedType] = useState<string>("");
  const navigate = useNavigate();

  const handleContinue = () => {
    console.log("Selected user type:", selectedType);
    if (selectedType === "event-organizer") {
      navigate({ to: "/Onboarding/Services" });
    } else {
      navigate({ to: "/Onboarding/ServiceVendor" });
    }
  };

  return (
    <div className="min-h-screen flex bg-white justify-center items-center">
      <div className="flex flex-col justify-center items-center px-4">
        <div className="mx-auto mb-4">
          <img src={logo} alt="" className="w-[60px] h-[60px]" />
        </div>
        <h2 className="text-black header">How are you going to use Eve?</h2>
        <p className="text-black para">
          Tell Us Who You Are, Choose one to get the most relevant features and recommendations.
        </p>

        {/* User type selector */}
        <div className="w-full max-w-md space-y-0 mb-8">
          {userTypes.map((userType) => (
            <UserTypeCard
              key={userType.id}
              userType={userType}
              isSelected={selectedType === userType.id}
              onClick={() => setSelectedType(userType.id)}
            />
          ))}
        </div>

        <div className="w-full max-w-md">
          <CustomButton title="Continue" onClick={handleContinue} disabled={ selectedType === "" ? true : false }/>
        </div>
      </div>

      {/* Decorative elements on the bottom side */}
      <div className="absolute bottom-0 right-0 overflow-hidden pointer-events-none">
        <div className="relative">
          <img src={bottom} alt="" className="w-full" />
        </div>
      </div>
    </div>
  );
}
