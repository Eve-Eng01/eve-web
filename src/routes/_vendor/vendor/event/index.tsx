import { events } from "@/dummy-data/eventList";
import { useAuthStore } from "@/shared/stores/auth-store";
import {
  DropdownInput,
  DropdownOption,
} from "@components/accessories/dropdown-input";
import { InputField } from "@components/accessories/input-field";
import { DashboardLayout } from "@components/layouts/dashboard-layout";
import EventList from "@components/pages/vendor/event-list";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import {
  extractErrorMessage,
  useDiscoverEventsForVendor,
} from "@/shared/api/services/events";
import { useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import countries from "world-countries";

export const Route = createFileRoute("/_vendor/vendor/event/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [search, setSearch] = useState("");
  const [service, setService] = useState<DropdownOption | null>(null);
  const [country, setCountry] = useState<DropdownOption | null>(null);
  const [searchToSend, setSearchToSend] = useState("");
  const processSearch = useDebouncedCallback((value: string) => {
    setSearchToSend(value);
  }, 500);
  const user = useAuthStore((state) => state.user);
  const userName = user ? `${user.firstName} ${user.lastname}`.trim() : "User";
  const {
    data: eventsData,
    error: eventsError,
    refetch: refetchEvents,
  } = useDiscoverEventsForVendor({ search: searchToSend });
  const isEventLoading = useMemo(() => {
    return !eventsData && !eventsError;
  }, [eventsData, eventsError]);

  const countriesOptions: DropdownOption[] = useMemo(() => {
    return countries.map((country) => ({
      value: country.cca2,
      label: country.name.common,
      flag: country.flag,
    }));
  }, []);

  return (
    <DashboardLayout isVendor>
      <div className="space-y-10 py-4">
        <div className="space-y-2 w-full">
          <h1 className="text-[clamp(1.3rem,2vw,2rem)] font-medium text-gray-900">
            Hello, {userName} 👋👋
          </h1>
        </div>
        <div className="space-y-2">
          <div className="min-[1000px]:flex-row flex flex-col-reverse min-[1000px]:items-center gap-4">
            <div className="flex-1 flex flex-row items-center gap-4 min-[1000px]:max-w-[400px]">
              <DropdownInput
                className="flex-1"
                options={countriesOptions}
                value={null}
                onChange={(countryDetails) => {
                  setCountry(countryDetails);
                }}
                searchable
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
                value={search}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearch(value);
                  processSearch(value);
                }}
                className="border border-black/10 rounded-xl pl-11"
                placeholder="Search for events, vendors....."
              />
              <span className="h-full inline-flex items-center absolute left-4 top-1/2 -translate-y-1/2">
                <Search className="text-gray-500 size-[1.2rem]" />
              </span>
            </div>
          </div>
          <EventList
            events={
              eventsData?.pages
                ?.flatMap((page) => page?.data?.result?.events || [])
                ?.filter(Boolean) || []
            }
            hideSeeMore
            hideHeader
            loading={isEventLoading}
            error={eventsError ? extractErrorMessage(eventsError) : null}
            refetch={refetchEvents}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
