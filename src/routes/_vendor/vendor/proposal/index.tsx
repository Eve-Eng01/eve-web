import { proposals } from "@/dummy-data/proposal";
import DataTable from "@components/accessories/data-table";
import FilterDropdown from "@components/accessories/filter-dropdown";
import { InputField } from "@components/accessories/input-field";
import { CustomButton } from "@components/button/button";
import { DashboardLayout } from "@components/layouts/dashboard-layout";
import StatCard from "@components/pages/vendor/proposal/stat-card";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ChevronRight, Search } from "lucide-react";

export const Route = createFileRoute("/_vendor/vendor/proposal/")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  return (
    <DashboardLayout isVendor>
      <div className="space-y-8">
        <CustomButton
          onClick={() => router.history.back()}
          title="Go back"
          className="text-sm w-auto px-4 py-3 border opacity-60 bg-transparent text-default"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Proposals Sent" value="10" />
          <StatCard title="Proposals Accepted" value="10" />
          <StatCard title="RFPs Received" value="10" />
          <StatCard title="Available Events" value="10" />
        </div>
        <div className="space-y-3">
          <div className="flex-row items-center justify-between flex gap-6">
            <div className="relative flex-1">
              <InputField
                placeholder="Search for Users booking ID, Attendee Name etc"
                value=""
                onChange={() => {}}
                className="border border-black/10 rounded-xl pl-11"
              />
              <span className="h-full inline-flex items-center absolute left-4 top-1/2 -translate-y-1/2">
                <Search className="text-gray-500 size-[1.2rem]" />
              </span>
            </div>
            <FilterDropdown
              options={[
                {
                  id: "1",
                  label: "Accepted",
                  value: "accepted",
                },
                {
                  id: "2",
                  label: "Pending",
                  value: "pending",
                },
                {
                  id: "3",
                  label: "Declined",
                  value: "declined",
                },
                {
                  id: "4",
                  label: "WIthdrawn",
                  value: "withdrawn",
                },
              ]}
              selectedValues={[]}
              onSelectionChange={() => {}}
              multiple={false}
            />
          </div>
          <DataTable
            data={proposals.map((proposal) => {
              let statusClassName = "text-green-500";
              const status = proposal?.status?.toLowerCase();
              if (status === "pending") {
                statusClassName = "text-orange-500";
              }
              if (status === "declined") {
                statusClassName = "text-red-500";
              }
              if (status === "withdrawn") {
                statusClassName = "text-gray-500";
              }
              return {
                eventName: proposal.eventName,
                proposalId: proposal.proposalID,
                amount: proposal.amount,
                status: (
                  <span className={statusClassName}>● {proposal.status}</span>
                ),
                submittedOn: (
                  <span className="text-gray-500 inline-flex items-center gap-5">
                    {proposal.submittedOn}

                    <ChevronRight className="size-5" />
                  </span>
                ),
              };
            })}
            itemsPerPage={10}
            onPageChange={() => {}}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
