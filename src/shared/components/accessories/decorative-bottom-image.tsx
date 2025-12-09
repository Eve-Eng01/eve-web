import React from "react";
import bottom from "@assets/onBoarding/bottom.png";

export const DecorativeBottomImage: React.FC = () => {
  return (
    <div className="absolute w-full bottom-0 left-1/2 -translate-x-1/2 overflow-hidden pointer-events-none hidden sm:block">
      <div className="flex justify-center items-center">
        <img
          src={bottom}
          alt=""
          className="w-full lg:max-w-[950px]"
        />
      </div>
    </div>
  );
};

