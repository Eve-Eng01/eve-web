import Spinner from "@components/accessories/spinner";
import { InfoIcon, TriangleAlert } from "lucide-react";
import React, { memo } from "react";

type DashboardStatCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: string;
  loading?: boolean;
  error?: string | null;
};

function DashboardStatCard({
  title,
  value,
  icon,
  description,
  loading = false,
  error,
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
      {!error && (
        <p className="font-semibold text-[#7417C6] text-2xl">
          {loading ? <Spinner className="size-6" /> : value || 0}
        </p>
      )}
      {error && (
        <p className="text-red-500 text-xs opacity-60">
          <span>
            <TriangleAlert className="size-4 inline-block mr-1" />
          </span>
          <span>{error}</span>
        </p>
      )}

      <div className="text-black/20 flex items-center gap-1 justify-end">
        <InfoIcon className="size-4" />
        <p className="text-xs text-right ">{description || "No data yet"}</p>
      </div>
    </div>
  );
}

export default memo(DashboardStatCard);
