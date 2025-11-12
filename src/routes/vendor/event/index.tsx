import { events } from "@/dummy-data/eventList";
import { DropdownInput } from "@components/accessories/dropdown-input";
import { InputField } from "@components/accessories/input-field";
import { DashboardLayout } from "@components/layouts/dashboard-layout";
import EventList from "@components/pages/vendor/event-list";
import { User } from "@routes/organizer";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";

export const Route = createFileRoute("/vendor/event/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <DashboardLayout user={User} isVendor>
      <div className="space-y-10 py-4">
        <div className="space-y-2 w-full">
          <h1 className="text-[clamp(1.3rem,2vw,2rem)] font-medium text-gray-900">
            Hello, Anthony Mary 👋👋
          </h1>
        </div>
        <div className="space-y-2">
          <div className="min-[1000px]:flex-row flex flex-col-reverse min-[1000px]:items-center gap-4">
            <div className="flex-1 flex flex-row items-center gap-4 min-[1000px]:max-w-[400px]">
              <DropdownInput
                className="flex-1"
                options={[]}
                value={null}
                onChange={() => {}}
                placeholder="Nigeria"
              />
              <DropdownInput
                className="flex-1"
                options={[]}
                value={null}
                onChange={() => {}}
                placeholder="Service type"
              />
            </div>
            <div className="flex-1 relative">
              <InputField
                value=""
                onChange={() => {}}
                className="border border-black/10 rounded-xl pl-11"
                placeholder="Search for events, vendors....."
              />
              <span className="h-full inline-flex items-center absolute left-4 top-1/2 -translate-y-1/2">
                <Search className="text-gray-500 size-[1.2rem]" />
              </span>
            </div>
          </div>
          <EventList events={events} hideSeeMore hideHeader />
        </div>
      </div>
    </DashboardLayout>
  );
}
