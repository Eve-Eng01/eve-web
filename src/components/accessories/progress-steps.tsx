import React from "react";

interface ProgressStepsProps {
  total: number;
  current: number;
  className?: string;
  barClassName?: string;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({
  total,
  current,
  className = "",
  barClassName = "",
}) => {
  const steps = Array.from({ length: total }, (_, index) => index + 1);

  // Calculate dynamic width based on number of steps
  // Ensures responsive sizing across different screen sizes
  const getMaxWidth = () => {
    if (total <= 3) return "max-w-xs"; // 320px
    if (total <= 5) return "max-w-sm"; // 384px
    if (total <= 7) return "max-w-md"; // 448px
    return "max-w-lg"; // 512px
  };

  return (
    <div className={`flex justify-center mb-8 ${className}`.trim()}>
      <div className={`flex gap-2 w-full ${getMaxWidth()} px-4`}>
        {steps.map((step) => (
          <div
            key={step}
            className={`flex-1 min-w-[32px] h-2 rounded-full transition-colors ${
              step <= current ? "bg-purple-600" : "bg-gray-300"
            } ${barClassName}`.trim()}
          />
        ))}
      </div>
    </div>
  );
};

