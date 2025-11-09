import React from "react";

interface BuildingIconWhiteProps {
  className?: string;
  size?: number;
}

export const BuildingIconWhite: React.FC<BuildingIconWhiteProps> = ({
  className = "",
  size = 32,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M4 27.999H28M8 23.999V13.3323M13.3333 23.999V13.3323M18.6667 23.999V13.3323M24 23.999V13.3323M26.6667 9.33232L16.5653 3.01899C16.3602 2.89081 16.2577 2.82672 16.1477 2.80173C16.0505 2.77963 15.9495 2.77963 15.8523 2.80173C15.7423 2.82672 15.6398 2.89081 15.4347 3.01899L5.33333 9.33232H26.6667Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

