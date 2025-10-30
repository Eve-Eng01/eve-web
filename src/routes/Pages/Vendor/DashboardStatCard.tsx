import { InfoIcon } from "lucide-react";
import React, { memo } from "react";

type DashboardStatCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: string;
};

function DashboardStatCard({
  title,
  value,
  icon,
  description,
}: DashboardStatCardProps) {
  return (
    <div className="space-y-3 p-3 rounded-lg border border-black/10 bg-[#F4F4F4]">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h3 className="font-medium text-black/70">{title}</h3>
        </div>
        <span className="bg-white size-8 rounded-md inline-flex items-center justify-center text-black/60">
          {icon}
        </span>
      </div>
      <p className="font-semibold text-[#7417C6] text-2xl">{value || 0}</p>

      <div className="text-black/20 flex items-center gap-1 justify-end">
        <InfoIcon className="size-4" />
        <p className="text-xs text-right ">{description || "No data yet"}</p>
      </div>
    </div>
  );
}

export default memo(DashboardStatCard);
