import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@components/layouts/dashboard-layout";

import DashboardStatCard from "@components/pages/vendor/dashboard/dashboard-stat";
import { BadgeCheckIcon, Calendar, PlaneIcon } from "lucide-react";
import { CustomButton } from "@components/button/button";
import EventList from "@components/pages/vendor/event-list";
import { useAuthStore } from "@/shared/stores/auth-store";
import { events } from "@/dummy-data/eventList";
import { useGetAggregatorData } from "@/shared/api/services/dashboard/dashbord.hooks";
import { useMemo } from "react";
import { extractErrorMessage } from "@/shared/api/services/events/events-error-handler";
import { useDiscoverEventsForVendor } from "@/shared/api/services/events";

export const Route = createFileRoute("/_vendor/vendor/")({
  component: RouteComponent,
});

const BUTTON_CLASSNAME = "text-sm w-auto px-4 py-2",
  STAT_ICON_CLASSNAME = "size-5";

export function RouteComponent() {
  const user = useAuthStore((state) => state.user);
  const userName = user ? `${user.firstName} ${user.lastname}`.trim() : "User";
  const { data: aggregatorData, error: aggregatorError } =
    useGetAggregatorData();
  const {
    data: eventsData,
    error: eventsError,
    refetch: refetchEvents,
  } = useDiscoverEventsForVendor();
  const isLoading = useMemo(
    () => !aggregatorData && !aggregatorError,
    [aggregatorData, aggregatorError]
  );
  const errorMessage = useMemo(() => {
    if (aggregatorError) {
      return extractErrorMessage(aggregatorError);
    }
    return null;
  }, [aggregatorError]);

  const eventErrorMessage = useMemo(() => {
    if (eventsError) {
      return extractErrorMessage(eventsError);
    }
    return null;
  }, [eventsError]);

  const isEventLoading = useMemo(() => {
    return !eventsData && !eventsError;
  }, [eventsData, eventsError]);
  return (
    <DashboardLayout isVendor>
      <div className="space-y-10 md:space-y-14 py-4">
        <div className="flex items-start min-[1300px]:items-end min-[1300px]:justify-between flex-col min-[1300px]:flex-row gap-4">
          <div className="space-y-2 flex-1 shrink-0">
            <h1 className="text-[clamp(1.3rem,2vw,2rem)] font-medium text-gray-900">
              Good morning, {userName} 👋👋
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
            value={
              aggregatorData?.data?.aggregatedProposals?.sent?.toString() || "0"
            }
            error={errorMessage}
            icon={<PlaneIcon className={STAT_ICON_CLASSNAME} />}
            loading={isLoading}
          />
          <DashboardStatCard
            title="Proposals Accepted"
            value={
              aggregatorData?.data?.aggregatedProposals?.accepted?.toString() ||
              "0"
            }
            error={errorMessage}
            icon={<BadgeCheckIcon className={STAT_ICON_CLASSNAME} />}
            description="-8% this week"
            loading={isLoading}
          />
          <DashboardStatCard
            title="RFPs Received"
            value={
              aggregatorData?.data?.aggregatedProposals?.received?.toString() ||
              "0"
            }
            error={errorMessage}
            icon={<BadgeCheckIcon className={STAT_ICON_CLASSNAME} />}
            description="-8% this week"
            loading={isLoading}
          />
          <DashboardStatCard
            title="Available Events"
            value="10"
            error={errorMessage}
            icon={<Calendar className={STAT_ICON_CLASSNAME} />}
            description="-8% this week"
            loading={isLoading}
          />
        </div>
        <EventList
          events={
            eventsData?.pages
              ?.flatMap((page) => page?.data?.result?.events || [])
              ?.filter(Boolean) || []
          }
          title="Event Opportunities for You"
          error={eventErrorMessage}
          loading={isEventLoading}
          refetch={refetchEvents}
        />
      </div>
    </DashboardLayout>
  );
}
