import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@components/layouts/dashboard-layout";

import DashboardStatCard from "@components/pages/vendor/dashboard/dashboard-stat";
import { BadgeCheckIcon, Calendar, PlaneIcon } from "lucide-react";
import { CustomButton } from "@components/button/button";
import EventList from "@components/pages/vendor/event-list";
import { User } from "@routes/_organizer/organizer";
import { events } from "@/dummy-data/eventList";


export const Route = createFileRoute("/_vendor/vendor/")({
  component: RouteComponent,
});

const BUTTON_CLASSNAME = "text-sm w-auto px-4 py-2",
  STAT_ICON_CLASSNAME = "size-5";

export function RouteComponent() {
  return (
    <DashboardLayout isVendor user={User}>
      <div className="space-y-10 md:space-y-14 py-4">
        <div className="flex items-start min-[1300px]:items-end min-[1300px]:justify-between flex-col min-[1300px]:flex-row gap-4">
          <div className="space-y-2 flex-1 shrink-0">
            <h1 className="text-[clamp(1.3rem,2vw,2rem)] font-medium text-gray-900">
              Good morning, Anthony Mary 👋👋
            </h1>
            <p className="text-gray-500">
              Here’s what’s happening with your business today.
            </p>
          </div>

          <div className="flex min-[1300px]:items-center flex-row gap-4 shrink-0">
            <CustomButton className={BUTTON_CLASSNAME} title="Browse Event" />
            <CustomButton
              className={BUTTON_CLASSNAME}
              title="Submit Proposal"
            />
            <CustomButton className={BUTTON_CLASSNAME} title="View earnings" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 w-full">
          <DashboardStatCard
            title="Proposals Sent"
            value="10"
            icon={<PlaneIcon className={STAT_ICON_CLASSNAME} />}
          />
          <DashboardStatCard
            title="Proposals Accepted"
            value="10"
            icon={<BadgeCheckIcon className={STAT_ICON_CLASSNAME} />}
            description="-8% this week"
          />
          <DashboardStatCard
            title="RFPs Received"
            value="10"
            icon={<BadgeCheckIcon className={STAT_ICON_CLASSNAME} />}
            description="-8% this week"
          />
          <DashboardStatCard
            title="Available Events"
            value="10"
            icon={<Calendar className={STAT_ICON_CLASSNAME} />}
            description="-8% this week"
          />
        </div>
        <EventList events={events} title="Event Opportunities for You" />
      </div>
    </DashboardLayout>
  );
}
