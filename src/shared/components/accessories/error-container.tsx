import { TriangleAlert } from "lucide-react";
import React, { memo } from "react";
import { CustomButton } from "../button/button";

const ErrorContainer: React.FC<{
  error: string;
  refetchFunction?: () => void;
}> = ({ error, refetchFunction }) => {
  return (
    <div className="flex flex-col items-center gap-6 justify-center py-12 min-h-[400px]">
      <div className="flex-col flex items-center justify-center gap-2">
        <TriangleAlert className="size-20 inline-block mr-1 text-red-500" />
        <span className="text-red-500 text-sm opacity-60">{error}</span>
      </div>
      {refetchFunction && (
        <CustomButton
          className="w-auto"
          title="Retry"
          onClick={refetchFunction}
        />
      )}
    </div>
  );
};

export default memo(ErrorContainer);
