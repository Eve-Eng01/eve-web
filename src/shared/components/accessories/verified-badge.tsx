import React from "react";
import verifiedBadgeBg from "@assets/verified-badge-bg.svg";
import verifiedBadgeCheck from "@assets/verified-badge-check.svg";

interface VerifiedBadgeProps {
  className?: string;
  size?: number;
}

const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  className = "",
  size = 32,
}) => {
  const hasResponsiveClasses = className.includes("w-") || className.includes("h-");
  const sizeStyle = hasResponsiveClasses ? {} : { width: `${size}px`, height: `${size}px` };
  
  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={sizeStyle}
    >
      <img
        src={verifiedBadgeBg}
        alt="Verified badge background"
        className="absolute inset-0 w-full h-full"
      />
      <img
        src={verifiedBadgeCheck}
        alt="Verified checkmark"
        className="relative z-10 w-[43.75%] h-[43.75%]"
      />
    </div>
  );
};

export default VerifiedBadge;

