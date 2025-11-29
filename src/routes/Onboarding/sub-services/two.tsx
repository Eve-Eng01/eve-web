import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useState } from "react";
import logo from "@assets/evaLogo.png";
import "../onboard.css";
import { TickCircle } from "iconsax-reactjs";
import { CustomButton } from "@components/accessories/button";
import {
  AvaliabilityTypeCardProps,
  avaliabilityTypes,
} from "../../../dummy-data/data";
import { ServiceOneProps } from "./one";

const AvaliableTypeCard: React.FC<AvaliabilityTypeCardProps> = ({
  avaliableType,
  isSelected,
  onClick,
}) => {
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
          {avaliableType.title}
        </h3>
        {avaliableType.description && (
          <p
            className={`
            text-sm
            mt-1
            ${isSelected ? "text-purple-600" : "text-gray-600"}
          `}
          >
            {avaliableType.description}
          </p>
        )}
      </div>

      {/* Check icon */}
      <div>
        <TickCircle
          color={isSelected ? "#7417C6" : "#D5D5D5"}
          variant="Outline"
        />
      </div>
    </div>
  );
};

export const Route = createFileRoute("/Onboarding/sub-services/two")({
  component: ServiceTwo,
});

export function ServiceTwo({
  continue: handleContinue,
  back: handleGoBack,
}: ServiceOneProps) {
  const [selectedType, setSelectedType] = useState<string>("");

  return (
    <div className="min-h-screen flex bg-white justify-center items-center">
      <div className="flex flex-col justify-center items-center px-4">
        <div className="mx-auto mb-4">
          <img src={logo} alt="" className="w-[60px] h-[60px]" />
        </div>
        <h2 className="text-black header">Set Your Availability</h2>
        <p className="text-black para">
          Join a network of trusted vendors and grow your business by connecting
          with event planners and attendees.
        </p>

        {/* User type selector */}
        <div className="w-full max-w-md space-y-0 mb-8">
          {avaliabilityTypes.map((avaliableType) => (
            <AvaliableTypeCard
              key={avaliableType.id}
              avaliableType={avaliableType}
              isSelected={selectedType === avaliableType.id}
              onClick={() => setSelectedType(avaliableType.id)}
            />
          ))}
        </div>

        <div className="w-full max-w-md otherbtn">
          <CustomButton
            title="Continue"
            onClick={handleContinue}
            disabled={selectedType === "" ? true : false}
          />
          <button onClick={handleGoBack} className="goBack">
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}
