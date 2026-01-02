import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { DashboardLayout } from "@components/layouts/dashboard-layout";
import { CustomButton } from "@components/button/button";
import EventList from "@components/pages/vendor/event-list";
import { BadgeCheck, MessageSquareTextIcon, SendIcon } from "lucide-react";
import { events } from "@/dummy-data/eventList";
import InformationCard from "@components/accessories/information-card";
import {
  extractErrorMessage,
  useGetEventById,
} from "@/shared/api/services/events";
import ErrorContainer from "@components/accessories/error-container";
import Spinner from "@components/accessories/spinner";
import { useMemo } from "react";

export const Route = createFileRoute("/_vendor/vendor/event/$eventId/")({
  component: RouteComponent,
});

const EVENT_DATA_CLASSNAME = "justify-between";

function RouteComponent() {
  const { eventId } = Route.useParams();
  const navigate = useNavigate();
  const {
    data: eventData,
    error: eventError,
    refetch: refetchEvent,
  } = useGetEventById(eventId || "", true, true);
  const eventDetails = useMemo(() => {
    return eventData?.data?.data?.event || eventData?.data?.event || null;
  }, [eventData]);
  console.log(eventId);
  const router = useRouter();
  return (
    <DashboardLayout isVendor>
      {eventDetails && (
        <div className="space-y-8">
          <CustomButton
            onClick={() => router.history.back()}
            title="Go back"
            className="text-sm w-auto px-4 py-3 border opacity-60 bg-transparent text-default"
          />
          <div className="bg-[#f4f4f4] p-2 rounded-md space-y-4">
            <div className="w-full aspect-video max-h-[570px] relative bg-black/10">
              <img
                src={eventDetails?.media?.url || ""}
                alt="Event"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <h1 className="text-xl font-medium">{eventDetails?.name}</h1>
            <div className="flex items-center gap-2">
              <span className="bg-[#DDF5EB] text-[#17B26A] inline-flex py-1 px-2 text-xs rounded-md">
                New
              </span>

              <span className="bg-[#FEF4E6] text-[#F79009] inline-flex py-1 px-2 text-xs rounded-md">
                Closing soon
              </span>
            </div>
            <InformationCard
              className={EVENT_DATA_CLASSNAME}
              title="Date"
              value="October 25, 2025"
            />
            <InformationCard
              className={EVENT_DATA_CLASSNAME}
              title="Location"
              value={eventDetails?.location?.address || "N/A"}
            />
            <InformationCard
              className={EVENT_DATA_CLASSNAME}
              title="Service Needed"
              value={
                eventDetails?.vendorServices
                  ?.map((service) => service?.name)
                  .join(", ") || "N/A"
              }
            />
            <div className="w-full border-b border-black/10 border-dashed" />

            <InformationCard
              className={EVENT_DATA_CLASSNAME}
              title="Proposal Deadline"
              value="Catering & Audio-Visual Setup"
            />
            <InformationCard
              className={EVENT_DATA_CLASSNAME}
              title="Budget"
              value="$500k-1.2M"
            />
          </div>
          <div className="bg-[#f4f4f4] p-2 rounded-md space-y-2">
            <h1 className="text-lg font-medium">Event Description:</h1>
            <p className="opacity-60">{eventDetails?.description || "N/A"}</p>
          </div>
          <div className="bg-[#f4f4f4] p-2 rounded-md space-y-4">
            <h1 className="text-lg font-medium">Planner info:</h1>
            <InformationCard
              title="Planner Contact"
              value={`events@techsummitafrica.com | +234 809 555 1122`}
            />
            <InformationCard title="Event hosted" value="12" />
            <InformationCard title="Total budget spent" value="$95,000,000" />
            <InformationCard
              title="Success Rate"
              rightContent={
                <p className="font-medium">
                  <span className="text-green-500">92%</span> vendor
                  satisfaction
                </p>
              }
            />
            <InformationCard
              title="Verified"
              rightContent={
                <BadgeCheck
                  className="size-4 text-green-500"
                  fill="#17B26A"
                  stroke={"#ffffff"}
                  strokeWidth={2}
                />
              }
            />
          </div>
          <div className="flex items-center gap-6">
            <CustomButton
              title="Cancel"
              icon={<MessageSquareTextIcon className="size-4" />}
              className="flex-1 text-xs bg-transparent border border-[##7417C6] text-[#7417C6] hover:bg-[#7417C6]/10"
            />
            <CustomButton
              onClick={() =>
                navigate({ to: `/vendor/event/${eventId}/proposal` })
              }
              title="Send Proposal"
              className="flex-1 text-xs"
              icon={<SendIcon className="size-4" />}
            />
          </div>
          <EventList
            events={events.slice(0, 3)}
            title="See more events opportunities for you"
            className="mt-20"
          />
        </div>
      )}
      {!eventDetails && !eventError && (
        <div className="flex items-center justify-center py-12 min-h-[400px]">
          <Spinner className="size-12" />
        </div>
      )}
      {!eventDetails && !!eventError && (
        <ErrorContainer
          error={extractErrorMessage(eventError)}
          refetchFunction={refetchEvent}
        />
      )}
    </DashboardLayout>
  );
}
