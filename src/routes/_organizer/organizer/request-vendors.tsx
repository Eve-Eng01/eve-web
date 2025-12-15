import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Calendar, Clock, MapPin } from "lucide-react";
import { DashboardLayout } from "@components/layouts/dashboard-layout";
import { SearchableDropdown } from "@components/accessories/searchable-dropdown";
import { CategorySelectionTable } from "@components/accessories/category-selection-table";
import { IndividualProposalLimits } from "@components/accessories/individual-proposal-limits";
import { CustomButton } from "@components/accessories/button";
import { ArrowLeft } from "lucide-react";
import type { CategoryOption } from "@components/accessories/multi-select-category-dropdown";
import { getAllVendorCategories } from "@utils/vendor-categories";

export const Route = createFileRoute("/_organizer/organizer/request-vendors")({
  component: RouteComponent,
});

interface EventOption {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
}

interface RequestVendorsFormData {
  event: EventOption | null;
  selectedCategories: string[];
  proposalLimit: string;
  individualLimits: Record<string, string>;
  selectForAll: boolean;
}

function RouteComponent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RequestVendorsFormData>({
    event: null,
    selectedCategories: [],
    proposalLimit: "",
    individualLimits: {},
    selectForAll: true,
  });

  // Mock events data - replace with actual API call
  const events: EventOption[] = [
    {
      id: "1",
      name: "West Africa Event 2025",
      date: "15 Mar 2025",
      startTime: "10:00 AM",
      endTime: "4:00 PM",
      venue: "21 eve road, Lagos state, Nigeria.",
    },
    {
      id: "2",
      name: "Tech Innovators Summit",
      date: "20 Apr 2025",
      startTime: "9:00 AM",
      endTime: "5:00 PM",
      venue: "Lagos Convention Centre, Victoria Island, Lagos.",
    },
  ];

  // Vendor categories - using enum from design
  const vendorCategories: CategoryOption[] = getAllVendorCategories();

  const handleGoBack = (): void => {
    navigate({ to: "/organizer" });
  };

  const handleEventChange = (option: {
    value: string;
    label: string;
  }): void => {
    const selectedEvent = events.find((e) => e.id === option.value);
    if (selectedEvent) {
      setFormData((prev) => ({ ...prev, event: selectedEvent }));
    }
  };

  const handleCategoriesChange = (values: string[]): void => {
    setFormData((prev) => {
      // Update individual limits to only include selected categories
      const newIndividualLimits: Record<string, string> = {};
      values.forEach((value) => {
        if (prev.individualLimits[value]) {
          newIndividualLimits[value] = prev.individualLimits[value];
        }
      });
      return {
        ...prev,
        selectedCategories: values,
        individualLimits: newIndividualLimits,
      };
    });
  };

  const handleIndividualLimitsChange = (
    limits: Record<string, string>
  ): void => {
    setFormData((prev) => ({ ...prev, individualLimits: limits }));
  };

  const handleProposalLimitChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setFormData((prev) => ({ ...prev, proposalLimit: e.target.value }));
  };

  const handleSelectForAll = (): void => {
    setFormData((prev) => ({ ...prev, selectForAll: true }));
  };

  const handleSelectIndividually = (): void => {
    setFormData((prev) => ({ ...prev, selectForAll: false }));
  };

  const handleCancel = (): void => {
    navigate({ to: "/organizer" });
  };

  const handleSearch = (): void => {
    // TODO: Implement API call to request vendors
    console.log("Request vendors data:", formData);
    // Navigate to results or show success message
  };

  const isFormValid = (): boolean => {
    if (!formData.event || formData.selectedCategories.length === 0) {
      return false;
    }

    if (formData.selectForAll) {
      return formData.proposalLimit.trim() !== "";
    } else {
      // Check if all selected categories have limits
      return formData.selectedCategories.every(
        (category) =>
          formData.individualLimits[category] &&
          formData.individualLimits[category].trim() !== ""
      );
    }
  };

  // Convert events to dropdown options
  const eventOptions = events.map((event) => ({
    value: event.id,
    label: event.name,
  }));

  // Get selected categories as CategoryOption array
  const selectedCategoryOptions = vendorCategories.filter((category) =>
    formData.selectedCategories.includes(category.value)
  );

  return (
    <DashboardLayout>
      <div className="bg-white">
        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <CustomButton
            title="Go back"
            icon={<ArrowLeft className="h-4 w-4" />}
            onClick={handleGoBack}
            className="w-auto flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2.5 sm:py-3.5 border border-[#eaeaea] rounded-[14px] text-xs sm:text-sm font-medium text-[#777777] bg-transparent hover:bg-gray-50 disabled:bg-transparent shadow-none transition-colors"
          />
          <h1 className="text-base sm:text-lg md:text-xl font-medium text-[#2d2d2d] leading-[20px] sm:leading-[24px] md:leading-[28px] tracking-[0.1px]">
            Request Vendors
          </h1>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col gap-4 sm:gap-5 md:gap-6"
        >
          {/* Select Event */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[#5a5a5a] leading-5">
              Select Event
            </label>
            <div className="bg-[#f4f4f4] border-2 border-dashed border-[#dfdfdf] rounded-[16px] sm:rounded-[20px] p-1.5 sm:p-2">
              <SearchableDropdown
                options={eventOptions}
                value={
                  formData.event
                    ? {
                        value: formData.event.id,
                        label: formData.event.name,
                      }
                    : null
                }
                onChange={handleEventChange}
                placeholder="Select event"
                searchPlaceholder="Search events"
                triggerClassName="bg-white border-2 border-dashed border-[#dfdfdf] rounded-[12px] sm:rounded-[16px]"
              />
              {/* Event Details */}
              {formData.event && (
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-2.5 mt-2">
                  <div className="bg-white border border-dashed border-[#eaeaea] rounded-[8px] sm:rounded-[10px] px-2 py-1.5 sm:py-2 flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#777777] shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-[#777777] leading-4 sm:leading-5">
                      <span className="hidden sm:inline">Event Date: </span>
                      {formData.event.date}
                    </span>
                  </div>
                  <div className="bg-white border border-dashed border-[#eaeaea] rounded-[8px] sm:rounded-[10px] px-2 py-1.5 sm:py-2 flex items-center gap-1.5">
                    <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#777777] shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-[#777777] leading-4 sm:leading-5">
                      <span className="hidden sm:inline">Time </span>
                      {formData.event.startTime} – {formData.event.endTime}
                    </span>
                  </div>
                  <div className="bg-white border border-dashed border-[#eaeaea] rounded-[8px] sm:rounded-[10px] px-2 py-1.5 sm:py-2 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#777777] shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-[#777777] leading-4 sm:leading-5 truncate">
                      <span className="hidden sm:inline">Venue: </span>
                      {formData.event.venue}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Vendor Category Selection */}
          <div className="flex flex-col gap-3">
            <CategorySelectionTable
              label="Vendor Category Selection"
              categories={vendorCategories}
              selectedValues={formData.selectedCategories}
              onChange={handleCategoriesChange}
              placeholder="Select categories"
              searchPlaceholder="Search"
              columns={7}
            />
          </div>

          {/* Proposal Request Limit */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
              <label className="text-sm font-medium text-[#5a5a5a] leading-5">
                Proposal Request Limit
              </label>
              <div className="flex gap-2 sm:gap-3 items-center flex-wrap">
                <button
                  type="button"
                  onClick={handleSelectForAll}
                  className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-[8px] sm:rounded-[10px] border text-xs font-medium leading-4 tracking-[0.06px] transition-colors flex items-center gap-1.5 sm:gap-2 ${
                    formData.selectForAll
                      ? "border-[#7417c6] text-[#7417c6] bg-transparent"
                      : "border-[#aaaaaa] text-[#aaaaaa] bg-transparent"
                  }`}
                >
                  <span className="whitespace-nowrap">Select for all</span>
                  {formData.selectForAll && (
                    <svg
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleSelectIndividually}
                  className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-[8px] sm:rounded-[10px] border text-xs font-medium leading-4 tracking-[0.06px] transition-colors flex items-center gap-1.5 sm:gap-2 ${
                    !formData.selectForAll
                      ? "border-[#7417c6] text-[#7417c6] bg-transparent"
                      : "border-[#aaaaaa] text-[#aaaaaa] bg-transparent"
                  }`}
                >
                  <span className="whitespace-nowrap">Select Individually</span>
                  {!formData.selectForAll && (
                    <svg
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {formData.selectForAll ? (
              <input
                type="number"
                value={formData.proposalLimit}
                onChange={handleProposalLimitChange}
                placeholder="Enter proposal limit"
                min="1"
                className="h-[60px] sm:h-[70px] border-2 border-dashed border-[#dfdfdf] rounded-[12px] sm:rounded-[16px] px-3 sm:px-4 bg-[#f4f4f4] text-base sm:text-lg font-semibold text-[#2d2d2d] leading-[24px] sm:leading-[26px] tracking-[0.09px] focus:outline-none focus:ring-2 focus:ring-[#7417c6] focus:border-transparent"
              />
            ) : (
              <IndividualProposalLimits
                categories={selectedCategoryOptions}
                limits={formData.individualLimits}
                onChange={handleIndividualLimitsChange}
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 sm:justify-end mt-4 sm:mt-6 w-full sm:w-1/4 sm:ml-auto">
            <CustomButton
              title="Cancel"
              onClick={handleCancel}
              type="button"
              className="w-full sm:w-auto h-11 px-6 py-4 border border-[#f1e8f9] text-[#7417c6] rounded-xl text-base font-medium leading-6 tracking-[0.08px] bg-transparent hover:bg-[#f1e8f9] disabled:bg-transparent shadow-none transition-colors"
            />
            <CustomButton
              title="Search"
              type="submit"
              disabled={!isFormValid()}
              className="w-full sm:w-auto h-11 px-6 sm:px-12 py-4 rounded-xl text-base font-medium leading-6 tracking-[0.08px] hover:bg-[#6a15b8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

