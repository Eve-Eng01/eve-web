import React, { memo } from "react";

const StatCard: React.FC<{ title: string; value: string }> = ({
  title,
  value,
}) => {
  return (
    <div className="bg-[#F4F4F4] rounded-lg p-4 space-y-1">
      <p className="opacity-60 text-sm font-medium">{title}</p>
      <h1 className="font-semibold text-2xl text-[#7417C6]">{value}</h1>
    </div>
  );
};

export default memo(StatCard);
