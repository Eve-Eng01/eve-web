import React, { JSX, useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, X, Edit } from "lucide-react";
import { ArrowDown2, ArrowRight } from "iconsax-reactjs";
import { GiTechnoHeart, GiClothes } from "react-icons/gi";
import { RiNeteaseCloudMusicLine } from "react-icons/ri";
import { BiSolidParty } from "react-icons/bi";
import { FaBook } from "react-icons/fa";
import { MdOutlineFestival, MdDirectionsRun } from "react-icons/md";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { CustomButton } from "../../../button/button";
import { useCreateDraftEvent } from "@/shared/api/services/events/events.hooks";
import { prepareEventDraftData } from "./create-event-integration";
import { useToastStore } from "@/shared/stores/toast-store";
import {
  DropdownInput,
  DropdownOption,
} from "../../../accessories/dropdown-input";
import EventFormatSelector, { PlatformData, EventFormatSelectorHandle } from "../../../accessories/event-format-selector";
import Ticketing, { Ticket } from "./ticketing";
import MediaUpload, { MediaUploadHandle } from "./media-upload";
import Review from "./review";
import { TimePicker } from "../../../accessories/time-picker";
import SuccesConfirmationModal from "../../../accessories/sucess-confirmation-modal";
import { GooglePlacesAutocomplete } from "../../../accessories/google-places-autocomplete";

// Define interface for a single date-time entry (used in Recurring DateTimePicker)
interface DateTimeEntry {
  id: number;
  date: number;
  month: number;
  year: number;
  startTime: string;
  endTime: string;
  endTimeNextDay?: boolean;
}

// One-Time DateTimePicker Component
interface OneTimeDateTimePickerProps {
  selectedDate: number;
  setSelectedDate: (date: number) => void;
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  endTime: string;
  setEndTime: (time: string) => void;
  startTime: string;
  setStartTime: (time: string) => void;
  endTimeNextDay: boolean;
  setEndTimeNextDay: (nextDay: boolean) => void;
}

const OneTimeDateTimePicker: React.FC<OneTimeDateTimePickerProps> = ({
  selectedDate,
  setSelectedDate,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  endTime,
  setEndTime,
  startTime,
  setStartTime,
  endTimeNextDay,
  setEndTimeNextDay,
}) => {
  const [showEndTimePicker, setShowEndTimePicker] = useState<boolean>(false);
  const [showStartTimePicker, setShowStartTimePicker] =
    useState<boolean>(false);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const renderCalendar = () => {
    const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(selectedYear, selectedMonth, 0).getDate();

    const startDay = firstDay === 0 ? 6 : firstDay - 1;
    const days: JSX.Element[] = [];

    // Previous month days
    for (let i = startDay - 1; i >= 0; i--) {
      days.push(
        <button
          key={`prev-${i}`}
          className="aspect-square flex items-center justify-center text-gray-300 text-xs sm:text-sm hover:bg-gray-50 rounded-lg min-w-[32px] min-h-[32px] sm:min-w-[40px] sm:min-h-[40px]"
        >
          {daysInPrevMonth - i}
        </button>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = day === selectedDate;
      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(day)}
          className={`aspect-square flex items-center justify-center text-xs sm:text-sm rounded-full transition-colors min-w-[32px] min-h-[32px] sm:min-w-[40px] sm:min-h-[40px] ${
            isSelected
              ? "bg-purple-600 text-white font-semibold"
              : "text-gray-900 hover:bg-gray-100"
          }`}
        >
          {day}
        </button>
      );
    }

    // Next month days
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push(
        <button
          key={`next-${i}`}
          className="aspect-square flex items-center justify-center text-gray-300 text-xs sm:text-sm hover:bg-gray-50 rounded-lg min-w-[32px] min-h-[32px] sm:min-w-[40px] sm:min-h-[40px]"
        >
          {i}
        </button>
      );
    }

    return days;
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-[#F4F4F4] p-3 sm:p-4 lg:p-5">
        <div className="w-full">
          <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => {
                  if (selectedMonth === 0) {
                    setSelectedMonth(11);
                    setSelectedYear(selectedYear - 1);
                  } else {
                    setSelectedMonth(selectedMonth - 1);
                  }
                }}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
              <span className="font-semibold text-gray-900 text-sm sm:text-base">
                {months[selectedMonth]} {selectedYear}
              </span>
              <button
                onClick={() => {
                  if (selectedMonth === 11) {
                    setSelectedMonth(0);
                    setSelectedYear(selectedYear + 1);
                  } else {
                    setSelectedMonth(selectedMonth + 1);
                  }
                }}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-gray-600 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
          </div>
        </div>

        <div className="w-full space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Time
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                value={startTime}
                readOnly
                onClick={() => setShowStartTimePicker(true)}
                className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 border border-dashed text-black cursor-pointer text-sm sm:text-base ${
                  startTime ? "border-[#DFDFDF]" : "border-red-500"
                } rounded-lg focus:ring-2 focus:ring-purple-500 outline-none`}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Time
            </label>
            <div className="space-y-2">
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  value={endTime ? `${endTime}${endTimeNextDay ? " (+1)" : ""}` : ""}
                  readOnly
                  onClick={() => setShowEndTimePicker(true)}
                  placeholder={endTimeNextDay ? "Select end time (next day)" : "Select end time"}
                  className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 border border-dashed text-black cursor-pointer text-sm sm:text-base ${
                    endTime ? "border-[#DFDFDF]" : "border-red-500"
                  } rounded-lg focus:ring-2 focus:ring-purple-500 outline-none`}
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer group">
                <div
                  className={`flex items-center justify-center w-5 h-5 rounded-[3px] shrink-0 relative ${
                    endTimeNextDay ? "bg-[#7417C6]" : "bg-[#d5d5d5]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={endTimeNextDay}
                    onChange={(e) => setEndTimeNextDay(e.target.checked)}
                    className="appearance-none"
                  />
                  {endTimeNextDay && (
                    <svg
                      className="w-4 h-4 text-white absolute pointer-events-none"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  )}
                </div>
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  End time is next day
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {showEndTimePicker && (
        <TimePicker
          initialTime={endTime}
          onSelectTime={setEndTime}
          onClose={() => setShowEndTimePicker(false)}
        />
      )}

      {showStartTimePicker && (
        <TimePicker
          initialTime={startTime}
          onSelectTime={setStartTime}
          onClose={() => setShowStartTimePicker(false)}
        />
      )}
    </>
  );
};

// Recurring DateTimePicker Component
interface RecurringDateTimePickerProps {
  dateTimeEntries: DateTimeEntry[];
  setDateTimeEntries: (entries: DateTimeEntry[]) => void;
}

const RecurringDateTimePicker: React.FC<RecurringDateTimePickerProps> = ({
  dateTimeEntries,
  setDateTimeEntries,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(0); // January
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [showEndTimePicker, setShowEndTimePicker] = useState<number | null>(
    null
  );
  const [showStartTimePicker, setShowStartTimePicker] = useState<number | null>(
    null
  );

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const addNewEntry = () => {
    const newEntry: DateTimeEntry = {
      id: Date.now(),
      date: 1,
      month: selectedMonth,
      year: selectedYear,
      startTime: "",
      endTime: "",
      endTimeNextDay: false,
    };
    setDateTimeEntries([...dateTimeEntries, newEntry]);
  };

  const removeEntry = (id: number) => {
    setDateTimeEntries(dateTimeEntries.filter((entry) => entry.id !== id));
  };

  const updateEntry = (id: number, field: keyof DateTimeEntry, value: any) => {
    setDateTimeEntries(
      dateTimeEntries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const renderCalendar = () => {
    const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(selectedYear, selectedMonth, 0).getDate();

    const startDay = firstDay === 0 ? 6 : firstDay - 1;
    const days: JSX.Element[] = [];

    for (let i = startDay - 1; i >= 0; i--) {
      days.push(
        <button
          key={`prev-${i}`}
          className="aspect-square flex items-center justify-center text-gray-300 text-xs sm:text-sm hover:bg-gray-50 rounded-lg min-w-[32px] min-h-[32px] sm:min-w-[40px] sm:min-h-[40px]"
        >
          {daysInPrevMonth - i}
        </button>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = dateTimeEntries.some(
        (entry) =>
          entry.date === day &&
          entry.month === selectedMonth &&
          entry.year === selectedYear
      );
      days.push(
        <button
          key={day}
          onClick={() => {
            const newEntry: DateTimeEntry = {
              id: Date.now(),
              date: day,
              month: selectedMonth,
              year: selectedYear,
              startTime: "",
              endTime: "",
              endTimeNextDay: false,
            };
            setDateTimeEntries([...dateTimeEntries, newEntry]);
          }}
          className={`aspect-square flex items-center justify-center text-xs sm:text-sm rounded-full transition-colors min-w-[32px] min-h-[32px] sm:min-w-[40px] sm:min-h-[40px] ${
            isSelected
              ? "bg-[#7417C6] text-white font-semibold"
              : "text-gray-900 hover:bg-gray-100"
          }`}
        >
          {day}
        </button>
      );
    }

    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push(
        <button
          key={`next-${i}`}
          className="aspect-square flex items-center justify-center text-gray-300 text-xs sm:text-sm hover:bg-gray-50 rounded-lg min-w-[32px] min-h-[32px] sm:min-w-[40px] sm:min-h-[40px]"
        >
          {i}
        </button>
      );
    }

    return days;
  };

  return (
    <>
      <div className="bg-[#F4F4F4] p-3 sm:p-4 lg:p-5">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 border border-[#DFDFDF] p-3 sm:p-4 lg:p-5 rounded-lg bg-white mb-4">
          <label className="block text-sm sm:text-base font-medium text-gray-700">
            Select Dates and Times for your event
          </label>
          <button
            onClick={addNewEntry}
            className="bg-[#7417C6] text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm sm:text-base whitespace-nowrap w-full sm:w-auto"
          >
            Add New Date
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => {
                if (selectedMonth === 0) {
                  setSelectedMonth(11);
                  setSelectedYear(selectedYear - 1);
                } else {
                  setSelectedMonth(selectedMonth - 1);
                }
              }}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
            <span className="font-semibold text-gray-900 text-sm sm:text-base">
              {months[selectedMonth]} {selectedYear}
            </span>
            <button
              onClick={() => {
                if (selectedMonth === 11) {
                  setSelectedMonth(0);
                  setSelectedYear(selectedYear + 1);
                } else {
                  setSelectedMonth(selectedMonth + 1);
                }
              }}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-gray-600 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2">{renderCalendar()}</div>
        </div>

        <div className="mt-4 space-y-4">
          {dateTimeEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <span className="font-medium text-gray-700 text-sm sm:text-base whitespace-nowrap">
                  {entry.date} {months[entry.month]} {entry.year}
                </span>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 flex-1 sm:flex-initial">
                  <div className="flex items-center gap-2 sm:gap-4 flex-1 sm:flex-initial">
                    <div className="relative flex-1 sm:flex-initial sm:w-32">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      <input
                        type="text"
                        value={entry.startTime}
                        readOnly
                        onClick={() => setShowStartTimePicker(entry.id)}
                      className={`w-full sm:w-32 pl-9 sm:pl-10 pr-4 py-2 bg-gray-50 border border-dashed cursor-pointer text-sm sm:text-base text-gray-700 ${
                        entry.startTime ? "border-[#DFDFDF]" : "border-red-500"
                      } rounded-lg focus:ring-2 focus:ring-purple-500 outline-none`}
                      />
                    </div>
                    <span className="text-gray-600">-</span>
                    <div className="relative flex-1 sm:flex-initial sm:w-32">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      <input
                        type="text"
                        value={entry.endTime ? `${entry.endTime}${entry.endTimeNextDay ? " (+1)" : ""}` : ""}
                        readOnly
                        onClick={() => setShowEndTimePicker(entry.id)}
                      className={`w-full sm:w-32 pl-9 sm:pl-10 pr-4 py-2 bg-gray-50 border border-dashed cursor-pointer text-sm sm:text-base text-gray-700 ${
                        entry.endTime ? "border-[#DFDFDF]" : "border-red-500"
                      } rounded-lg focus:ring-2 focus:ring-purple-500 outline-none`}
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer shrink-0">
                    <div
                      className={`flex items-center justify-center w-5 h-5 rounded-[3px] shrink-0 relative ${
                        entry.endTimeNextDay ? "bg-[#7417C6]" : "bg-[#d5d5d5]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={entry.endTimeNextDay || false}
                        onChange={(e) => updateEntry(entry.id, "endTimeNextDay", e.target.checked)}
                        className="appearance-none"
                      />
                      {entry.endTimeNextDay && (
                        <svg
                          className="w-4 h-4 text-white absolute pointer-events-none"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                      )}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-700 whitespace-nowrap">
                      Next day
                    </span>
                  </label>
                </div>
              </div>
              <button
                onClick={() => removeEntry(entry.id)}
                className="text-red-500 hover:text-red-700 self-start sm:self-auto shrink-0"
                aria-label="Remove date"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {showEndTimePicker !== null && (
        <TimePicker
          initialTime={
            dateTimeEntries.find((entry) => entry.id === showEndTimePicker)
              ?.endTime || ""
          }
          onSelectTime={(time) =>
            updateEntry(showEndTimePicker, "endTime", time)
          }
          onClose={() => setShowEndTimePicker(null)}
        />
      )}

      {showStartTimePicker !== null && (
        <TimePicker
          initialTime={
            dateTimeEntries.find((entry) => entry.id === showStartTimePicker)
              ?.startTime || ""
          }
          onSelectTime={(time) =>
            updateEntry(showStartTimePicker, "startTime", time)
          }
          onClose={() => setShowStartTimePicker(null)}
        />
      )}
    </>
  );
};

// Step Indicator Component matching Figma design
interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  // Step icons matching Figma design
  const getStepIcon = (index: number) => {
    const isActive = index === currentStep;
    const isCompleted = index < currentStep;
    
    if (isCompleted) {
      // Completed step - filled circle with checkmark (24x24)
      return (
        <div className="w-6 h-6 bg-[#7417C6] rounded-full flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    } else if (isActive) {
      // Active step - filled circle with inner dot (24x24)
      return (
        <div className="w-6 h-6 bg-[#7417C6] rounded-full flex items-center justify-center shrink-0">
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>
      );
    } else {
      // Inactive step - outlined circle (22x22)
      return (
        <div className="w-[22px] h-[22px] border-2 border-gray-300 rounded-full bg-white shrink-0"></div>
      );
    }
  };

  return (
    <div className="flex items-center justify-center py-4 sm:py-6 border-t border-gray-200 overflow-x-auto">
      <div className="flex items-center gap-1.5 sm:gap-2 min-w-max px-4 sm:px-0">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <React.Fragment key={index}>
              <div className="flex items-center gap-1.5 sm:gap-2">
                {getStepIcon(index)}
                <span
                  className={`text-xs sm:text-sm font-normal whitespace-nowrap hidden sm:inline ${
                    isActive || isCompleted
                      ? "text-[#2d2d2d]"
                      : "text-[#aaa]"
                  }`}
                >
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div 
                  className={`h-px w-4 sm:w-7 ${
                    isCompleted ? "bg-[#d5b9ee]" : "bg-[#d5b9ee]"
                  }`}
                ></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// CreateEventForm Component
const CreateEventForm = () => {
  const navigate = useNavigate();
  const search = useSearch({ from: "/_organizer/organizer/events/create" });
  const showToast = useToastStore((state) => state.showToast);
  const createDraftEventMutation = useCreateDraftEvent();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [category, setCategory] = useState<DropdownOption | null>(null);
  const [format, setFormat] = useState("");
  const [platformData, setPlatformData] = useState<PlatformData | null>(null);
  const [recurrence, setRecurrence] = useState("on-time");
  const [timezone, setTimezone] = useState("");
  const [location, setLocation] = useState("");
  const [locationLatitude, setLocationLatitude] = useState<number | null>(null);
  const [locationLongitude, setLocationLongitude] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState(10);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [endTime, setEndTime] = useState("10:45 AM");
  const [startTime, setStartTime] = useState("2:45 PM");
  const [endTimeNextDay, setEndTimeNextDay] = useState(false);
  const [dateTimeEntries, setDateTimeEntries] = useState<DateTimeEntry[]>([
    {
      id: Date.now(),
      date: 1,
      month: 0,
      year: 2025,
      startTime: "",
      endTime: "",
      endTimeNextDay: false,
    },
  ]);
  const [selectedTicketType, setSelectedTicketType] = useState("paid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedTickets, setSavedTickets] = useState<Ticket[]>([]);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [eventId, setEventId] = useState<string | null>(null);
  const mediaUploadRef = useRef<MediaUploadHandle>(null);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const eventFormatSelectorRef = useRef<EventFormatSelectorHandle>(null);

  // Read eventId from query params on mount
  useEffect(() => {
    const queryParams = search as { eventId?: string; step?: number };
    if (queryParams.eventId) {
      setEventId(queryParams.eventId);
    }
  }, [search]);

  const eventCategories = [
    { value: "tech", label: "Tech", icon: <GiTechnoHeart className="w-5 h-5" /> },
    { value: "music-and-concert", label: "Music & Concert", icon: <RiNeteaseCloudMusicLine className="w-5 h-5" /> },
    { value: "nightlife-and-parties", label: "Nightlife & Parties", icon: <BiSolidParty className="w-5 h-5" /> },
    { value: "fashion", label: "Fashion", icon: <GiClothes className="w-5 h-5" /> },
    { value: "sport", label: "Sport", icon: <MdDirectionsRun className="w-5 h-5" /> },
    { value: "educational", label: "Educational", icon: <FaBook className="w-5 h-5" /> },
    { value: "festival", label: "Festivals", icon: <MdOutlineFestival className="w-5 h-5" /> },
  ];

  const steps = [
    "Event Information",
    "Ticketing & Pricing",
    "Media Upload",
    "Review & Publish",
  ];

  // Helper function to format timezone display string
  const formatTimezoneDisplay = (timeZoneName: string, rawOffset: number) => {
    const hoursOffset = Math.floor(Math.abs(rawOffset) / 3600);
    const minutesOffset = Math.floor((Math.abs(rawOffset) % 3600) / 60);
    const offsetSign = rawOffset >= 0 ? '+' : '-';
    const offsetString = `UTC ${offsetSign}${String(hoursOffset).padStart(2, '0')}:${String(minutesOffset).padStart(2, '0')}`;
    return `${timeZoneName} (${offsetString})`;
  };

  // Helper function to fetch timezone from coordinates
  const fetchTimezoneFromCoordinates = async (lat: number, lng: number) => {
    const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      console.error("Google Maps API key is not configured");
      setTimezone("Timezone detection unavailable - API key missing");
      return;
    }

    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${timestamp}&key=${apiKey}`;
      
      const timezoneResponse = await fetch(url);
      const timezoneData = await timezoneResponse.json();
      
      if (timezoneData.status === "OK") {
        // Use dstOffset + rawOffset for accurate current offset (accounts for daylight saving)
        const totalOffset = timezoneData.rawOffset + (timezoneData.dstOffset || 0);
        const formattedTimezone = formatTimezoneDisplay(
          timezoneData.timeZoneName,
          totalOffset
        );
        setTimezone(formattedTimezone);
      } else {
        console.error("Timezone API error:", timezoneData.status, timezoneData.errorMessage);
        setTimezone("Unable to detect timezone for this location");
      }
    } catch (error) {
      console.error("Error fetching timezone:", error);
      setTimezone("Error detecting timezone");
    }
  };

  // Handle place selection from autocomplete
  const handlePlaceSelect = async (place: {
    address: string;
    lat: number;
    lng: number;
  }) => {
    setLocation(place.address);
    setLocationLatitude(place.lat);
    setLocationLongitude(place.lng);
    // Set timezone based on location coordinates
    // Validate coordinates are valid (not 0,0 which indicates an error)
    if (place.lat && place.lng && place.lat !== 0 && place.lng !== 0) {
      await fetchTimezoneFromCoordinates(place.lat, place.lng);
    } else {
      console.warn("Invalid coordinates received:", place);
      setTimezone("Unable to detect timezone - invalid location coordinates");
    }
  };

  // Sync step from query params (but don't override if user is actively navigating)
  useEffect(() => {
    const queryParams = search as { eventId?: string; step?: number };
    if (queryParams.step !== undefined && 
        queryParams.step >= 0 && 
        queryParams.step < steps.length &&
        queryParams.step !== currentStep) {
      setCurrentStep(queryParams.step);
    }
  }, [search, steps.length, currentStep]);

  const handleGoBack = () => {
    navigate({ to: "/organizer" });
  };

  const handleSuccess = () => {
    navigate({ to: "/organizer" });
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      // Prepare and validate form data
      const formData = {
        eventName,
        description,
        customUrl,
        category: category?.value || null,
        format,
        platformData,
        recurrence,
        timezone,
        location,
        locationLatitude,
        locationLongitude,
        selectedDate,
        selectedMonth,
        selectedYear,
        startTime,
        endTime,
        endTimeNextDay,
        dateTimeEntries,
      };

      const { data: draftData, errors } = prepareEventDraftData(formData);

      if (errors.length > 0) {
        showToast(errors.join(", "), "error");
        return;
      }

      // Create draft event
      try {
        const result = await createDraftEventMutation.mutateAsync(draftData);
        
        // The API returns: { status: true, message: "...", data: { event: { _id: "..." } } }
        if (result.status) {
          const newEventId = result.data?.event?._id || result.data?.eventId;
          if (newEventId) {
            setEventId(newEventId);
            const nextStep = currentStep + 1;
            // Store eventId and step in query parameters
            navigate({
              to: "/organizer/events/create",
              search: { eventId: newEventId, step: nextStep },
              replace: true,
            });
            setCurrentStep(nextStep);
          } else {
            // Toast is handled by the hook's onSuccess
            const nextStep = currentStep + 1;
            navigate({
              to: "/organizer/events/create",
              search: { ...(search as Record<string, unknown>), step: nextStep },
              replace: true,
            });
            setCurrentStep(nextStep);
          }
        }
      } catch (error: any) {
        // Error toast is handled by the hook's onError
        console.error("Create draft event error:", error);
      }
    } else if (currentStep === 1) {
      if (savedTickets.length === 0) {
        setIsModalOpen(true); // Open modal if no tickets are created
        return;
      }
      if (currentStep < steps.length - 1) {
        const nextStep = currentStep + 1;
        navigate({
          to: "/organizer/events/create",
          search: { ...(search as Record<string, unknown>), step: nextStep },
          replace: true,
        });
        setCurrentStep(nextStep);
      }
    } else if (currentStep === 2) {
      // Media Upload step - upload image before proceeding
      if (mediaUploadRef.current) {
        // Check if there's an image to upload
        if (!mediaUploadRef.current.hasImage) {
          // No image selected, proceed to next step
          setCurrentStep(currentStep + 1);
          return;
        }

        // Upload the image
        setIsUploadingMedia(true);
        try {
          const success = await mediaUploadRef.current.uploadMedia();
          const nextStep = currentStep + 1;
          if (success) {
            // Upload successful - automatically proceed to next step
            navigate({
              to: "/organizer/events/create",
              search: { ...(search as Record<string, unknown>), step: nextStep },
              replace: true,
            });
            setCurrentStep(nextStep);
          } else {
            // Upload failed - show error but still allow proceeding
            // User can continue to review even if upload fails
            console.error("Media upload failed, but allowing user to proceed");
            // Still proceed to next step - upload is optional
            navigate({
              to: "/organizer/events/create",
              search: { ...(search as Record<string, unknown>), step: nextStep },
              replace: true,
            });
            setCurrentStep(nextStep);
          }
        } catch (error) {
          console.error("Media upload error:", error);
          // On error, still allow proceeding (image upload is optional)
          const nextStep = currentStep + 1;
          navigate({
            to: "/organizer/events/create",
            search: { ...(search as Record<string, unknown>), step: nextStep },
            replace: true,
          });
          setCurrentStep(nextStep);
        } finally {
          setIsUploadingMedia(false);
        }
      } else {
        // No ref, just proceed to next step
        const nextStep = currentStep + 1;
        navigate({
          to: "/organizer/events/create",
          search: { ...(search as Record<string, unknown>), step: nextStep },
          replace: true,
        });
        setCurrentStep(nextStep);
      }
    } else if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      navigate({
        to: "/organizer/events/create",
        search: { ...(search as Record<string, unknown>), step: nextStep },
        replace: true,
      });
      setCurrentStep(nextStep);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      navigate({
        to: "/organizer/events/create",
        search: { ...(search as Record<string, unknown>), step: prevStep },
        replace: true,
      });
      setCurrentStep(prevStep);
    }
  };

  const renderFormContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="p-6 space-y-8">
            {/* Event Name */}
            <div>
              <label className="block text-lg font-medium text-[#5a5a5a] mb-3">
                Enter Event Name
              </label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className={`w-full px-[18px] py-[18px] bg-[#f4f4f4] border-2 border-dashed text-black rounded-xl ${
                  eventName ? "border-[#DFDFDF]" : "border-red-500"
                } focus:ring-2 focus:ring-purple-500 outline-none`}
                placeholder="Enter event name"
              />
            </div>

            {/* Event Description */}
            <div>
              <label className="block text-lg font-medium text-[#5a5a5a] mb-3">
                Event Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                maxLength={1000}
                className={`w-full px-[18px] py-[18px] bg-[#f4f4f4] border-2 border-dashed text-black rounded-2xl ${
                  description ? "border-[#DFDFDF]" : "border-red-500"
                } focus:ring-2 focus:ring-purple-500 outline-none resize-none`}
                placeholder="Describe your event"
              />
              <div className="text-right text-base text-[#5a5a5a] mt-1">
                {description.length}/1000
              </div>
            </div>

            {/* Custom URL */}
            <div>
              <label className="block text-lg font-medium text-[#5a5a5a] mb-3">
                Add Custom URL <span className="text-sm font-normal text-gray-500">(Optional)</span>
              </label>
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="w-full px-[18px] py-[18px] bg-[#f4f4f4] border-2 border-dashed border-[#DFDFDF] text-black rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Enter custom URL (optional)"
              />
            </div>

            {/* Event Category */}
            <div>
              <DropdownInput
                className="mb-[30px]"
                label="Select Event Categories"
                options={eventCategories}
                value={category}
                onChange={(option) => setCategory(option)}
                placeholder="Select a category"
                searchable={true}
                addNewOption={true}
                onAddNew={(newCategory) => setCategory(newCategory)}
              />
            </div>

            {/* Format Selection */}
            <EventFormatSelector 
              ref={eventFormatSelectorRef}
              value={format} 
              onChange={setFormat}
              onPlatformDataChange={setPlatformData}
              initialPlatformData={platformData}
            />

            {/* Platform/Access Type Field - Show after modal completion for virtual and hybrid */}
            {(format === "virtual" || format === "hybrid") && platformData && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-lg font-medium text-[#5a5a5a]">
                    Platform / Access Type
                  </label>
                  <button
                    onClick={() => eventFormatSelectorRef.current?.openEditModal()}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[#7417C6] hover:bg-purple-50 rounded-lg transition-colors"
                    type="button"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                </div>
                <div className="bg-[#f4f4f4] border-2 border-dashed border-[#DFDFDF] rounded-xl p-4 space-y-3">
                  <div>
                    <span className="text-sm font-medium text-[#5a5a5a]">Platform: </span>
                    <span className="text-base font-semibold text-[#2d2d2d]">
                      {platformData.platform === "google_meet" ? "Google Meet" :
                       platformData.platform === "zoom" ? "Zoom" :
                       platformData.platform === "youtube_live" ? "YouTube Live" :
                       platformData.platform === "other" ? "Other" :
                       platformData.platform}
                    </span>
                  </div>
                  {platformData.meetingUrl && (
                    <div>
                      <span className="text-sm font-medium text-[#5a5a5a]">Meeting URL: </span>
                      <span className="text-base text-[#2d2d2d] break-all">
                        {platformData.meetingUrl}
                      </span>
                    </div>
                  )}
                  {platformData.meetingPassword && (
                    <div>
                      <span className="text-sm font-medium text-[#5a5a5a]">Password: </span>
                      <span className="text-base text-[#2d2d2d]">
                        ••••••••
                      </span>
                    </div>
                  )}
                  {platformData.note && (
                    <div>
                      <span className="text-sm font-medium text-[#5a5a5a]">Note: </span>
                      <span className="text-base text-[#2d2d2d]">
                        {platformData.note}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Recurrence */}
            <div>
              <label className="block text-lg font-medium text-[#5a5a5a] mb-4">
                Recurrence
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {["on-time", "recurring"].map((rec) => (
                  <label
                    key={rec}
                    className={`relative flex items-center px-4 py-4 rounded-2xl cursor-pointer transition-all border-2 border-dashed ${
                      recurrence === rec
                        ? "bg-[#f1e8f9] border-[#d5b9ee]"
                        : "border-[#eaeaea] bg-white hover:border-gray-400"
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center w-5 h-5 rounded-[3px] mr-3 ${
                        recurrence === rec ? "bg-[#7417C6]" : "bg-[#d5d5d5]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="recurrence"
                        value={rec}
                        checked={recurrence === rec}
                        onChange={(e) => setRecurrence(e.target.value)}
                        className="appearance-none"
                      />
                      {recurrence === rec && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                      )}
                    </div>
                    <span
                      className={`text-lg font-medium ${
                        recurrence === rec ? "text-[#2d2d2d]" : "text-[#777]"
                      }`}
                    >
                      {rec === "on-time" ? "One-Time" : "Recurring"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Timezone */}
            <div>
              <label className="block text-lg font-medium text-[#5a5a5a] mb-3">
                Select Time Zone
              </label>
              <div className={`w-full px-[18px] py-[18px] bg-[#f4f4f4] border-2 border-dashed rounded-xl text-[#2d2d2d] font-semibold text-xl ${
                timezone ? "border-[#DFDFDF]" : "border-gray-300"
              }`}>
                {timezone || (format === "virtual" 
                  ? "Please select your event timezone" 
                  : "Time zone will be automatically detected when you enter the event location")}
              </div>
            </div>

            {/* Location - Hidden for virtual events, shown for in-person and hybrid */}
            {format !== "virtual" && (
              <div>
                <label className="block text-lg font-medium text-[#5a5a5a] mb-3">
                  Enter event Location
                </label>
                <div className="relative mb-3">
                  <GooglePlacesAutocomplete
                    value={location}
                    onChange={(value) => {
                      setLocation(value);
                      if (!value) {
                        setTimezone("");
                        setLocationLatitude(null);
                        setLocationLongitude(null);
                      }
                    }}
                    onPlaceSelect={handlePlaceSelect}
                    placeholder="Enter event Location"
                    className={`px-3 sm:px-4 lg:px-[18px] py-3 sm:py-4 lg:py-[18px] bg-white border-2 text-black rounded-xl sm:rounded-2xl text-sm sm:text-base focus:ring-2 focus:ring-[#7417C6] outline-none ${
                      location ? "border-[#d5b9ee]" : "border-purple-500"
                    }`}
                    parentClassName="relative z-10"
                  />
                </div>
                <div className="w-full h-[200px] sm:h-[250px] lg:h-[312px] bg-gray-100 rounded-2xl sm:rounded-3xl overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}&q=${
                      location ? encodeURIComponent(location) : "Lagos, Nigeria"
                    }`}
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            {/* Date and Time Picker */}
            <div className="bg-[#F4F4F4] p-2 sm:p-3 rounded-2xl sm:rounded-3xl">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 border-2 border-dashed border-[#DFDFDF] p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl bg-white mb-4">
                <label className="block text-base sm:text-lg font-medium text-[#5a5a5a]">
                  Select you the Date and Time for your event
                </label>
                {recurrence === "recurring" && (
                  <div className="flex gap-3 sm:gap-5 items-center">
                    <span className="text-[#2D2D2D] font-semibold text-sm sm:text-base">
                      {dateTimeEntries.length} Date
                      {dateTimeEntries.length !== 1 ? "s" : ""} Selected
                    </span>
                    <div className="drop">
                      <ArrowDown2 size="20" className="sm:w-6 sm:h-6" color="#000" />
                    </div>
                  </div>
                )}
              </div>
              {recurrence === "on-time" ? (
                <OneTimeDateTimePicker
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  selectedMonth={selectedMonth}
                  setSelectedMonth={setSelectedMonth}
                  selectedYear={selectedYear}
                  setSelectedYear={setSelectedYear}
                  endTime={endTime}
                  setEndTime={setEndTime}
                  startTime={startTime}
                  setStartTime={setStartTime}
                  endTimeNextDay={endTimeNextDay}
                  setEndTimeNextDay={setEndTimeNextDay}
                />
              ) : (
                <RecurringDateTimePicker
                  dateTimeEntries={dateTimeEntries}
                  setDateTimeEntries={setDateTimeEntries}
                />
              )}
            </div>
          </div>
        );
      case 1:
        return (
          <Ticketing
            selectedTicketType={selectedTicketType}
            setSelectedTicketType={setSelectedTicketType}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            onNext={handleNext}
            onTicketsChange={setSavedTickets}
            eventId={eventId || (search as { eventId?: string })?.eventId || null}
          />
        );
      case 2:
        return <MediaUpload ref={mediaUploadRef} eventId={eventId || (search as { eventId?: string })?.eventId || null} />;
      case 3:
        return <Review eventId={eventId || (search as { eventId?: string })?.eventId || null} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="w-full">
        {/* Header with Go back and Title */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap mb-6 sm:mb-8">
          <button
            onClick={handleGoBack}
            className="border border-[#eaeaea] px-3 py-2 sm:py-[14px] rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium text-[#777] hover:bg-gray-50 transition-colors"
          >
            Go back
          </button>
          <button className="bg-[#f1e8f9] px-3 sm:px-[14px] py-2 sm:py-[14px] rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold text-[#2d2d2d]">
            Create Event
          </button>
        </div>

        {/* Step Indicator */}
        <StepIndicator steps={steps} currentStep={currentStep} />

        {/* Form Content */}
        <div className="bg-white rounded-lg overflow-hidden">
          {renderFormContent()}

          {/* Footer with Cancel, Previous, Next buttons - Hide on Review step (step 3) */}
          {currentStep < steps.length - 1 && (
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 p-4 sm:p-6 min-w-0">
              <button
                className="border border-[#f1e8f9] px-6 sm:px-12 py-3 sm:py-4 text-sm sm:text-base font-medium text-[#7417C6] rounded-lg sm:rounded-[10px] hover:bg-purple-50 transition-colors w-full sm:w-auto order-3 sm:order-1 shrink-0"
                onClick={handleGoBack}
              >
                Cancel
              </button>
              {currentStep > 0 && (
                <button
                  className="px-6 py-3 sm:py-2 text-purple-600 font-medium hover:bg-purple-50 rounded-lg text-sm sm:text-base w-full sm:w-auto order-2 shrink-0"
                  onClick={handlePrevious}
                >
                  Previous
                </button>
              )}
              <div className="w-full sm:w-auto order-1 sm:order-3 shrink-0">
                <CustomButton
                  title="Next"
                  icon={
                    !isUploadingMedia ? <ArrowRight size="20" className="sm:w-6 sm:h-6" color="#fff" /> : undefined
                  }
                  onClick={handleNext}
                  className="w-full sm:w-auto px-6 sm:px-12 py-3 sm:py-4 h-auto sm:h-[56px] rounded-lg sm:rounded-[10px] whitespace-nowrap"
                  disabled={
                    createDraftEventMutation.isPending || isUploadingMedia
                  }
                  loading={isUploadingMedia}
                />
              </div>
            </div>
          )}
        </div>
      </div>

 

      <SuccesConfirmationModal
        isOpen={successModalOpen}
        onClose={() => {
          setSuccessModalOpen(false);
        }}
        onConfirm={handleSuccess}
        onRequestVendors={() => {
          setSuccessModalOpen(false);
          navigate({ to: "/organizer/request-vendors" });
        }}
        title="Event Booked Successfully!"
        description={
          <p className="text-gray-600 mb-8 px-4 leading-relaxed">
            Your event <b>Elevate 2025: Innovation & Impact Summit</b> has been
            created. Next, you can go to your dashboard to manage all details,
            or start searching for vendors and sending proposal requests
          </p>
        }
      />
    </>
  );
};

export default CreateEventForm;

