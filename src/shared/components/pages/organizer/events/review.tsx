import React, { useState, useEffect, useRef } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Edit,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  MoreVertical,
  Trash2,
  BadgeCheck,
} from "lucide-react";
import { Ticket2 } from "iconsax-reactjs";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { 
  useGetEventById, 
  useGetTickets, 
  useUpdateEvent,
  useCreateTicket,
  useUpdateTicket,
  useDeleteTickets,
  useToggleTicketVisibility,
} from "@/shared/api/services/events/events.hooks";
import { useUploadMedia } from "@/shared/api/services/events/events.hooks";
import { eventsKeys } from "@/shared/api/services/events/events.hooks";
import type { Event, Ticket as ApiTicket, CreateTicketRequest, UpdateTicketRequest } from "@/shared/api/services/events/types";
import Modal from "../../../accessories/main-modal";
import MediaUpload, { MediaUploadHandle } from "./media-upload";
import { TimePicker } from "../../../accessories/time-picker";
import { GooglePlacesAutocomplete } from "../../../accessories/google-places-autocomplete";
import { useToastStore } from "@/shared/stores/toast-store";
import { useQueryClient } from "@tanstack/react-query";
import { DropdownInput, DropdownOption } from "../../../accessories/dropdown-input";
import DeleteConfirmationModal from "../../../accessories/delete-confirmation-modal";
import { CustomButton } from "../../../accessories/button";

// Utility functions for currency formatting
const formatCurrency = (value: string | number, includeDecimals: boolean = true): string => {
  const numValue = typeof value === "string" ? value.replace(/,/g, "") : value.toString();
  const num = parseFloat(numValue);
  
  if (isNaN(num) || numValue === "") {
    return "";
  }
  
  if (includeDecimals) {
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } else {
    const hasDecimals = numValue.includes(".");
    return num.toLocaleString("en-US", {
      minimumFractionDigits: hasDecimals ? 2 : 0,
      maximumFractionDigits: 2,
    });
  }
};

const parseCurrency = (value: string): string => {
  return value.replace(/,/g, "");
};

interface ReviewProps {
  eventId?: string | null;
}

// Calendar Picker Component for Publish Date
interface CalendarPickerProps {
  selectedDate: Date | null;
  selectedTime: string;
  onDateChange: (date: Date | null) => void;
  onTimeChange: (time: string) => void;
}

const CalendarPicker: React.FC<CalendarPickerProps> = ({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(
    selectedDate?.getMonth() || new Date().getMonth()
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    selectedDate?.getFullYear() || new Date().getFullYear()
  );
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);

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
          className="aspect-square flex items-center justify-center text-gray-300 text-sm hover:bg-gray-50 rounded-lg min-w-[40px] min-h-[40px]"
        >
          {daysInPrevMonth - i}
        </button>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected =
        selectedDate &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === selectedMonth &&
        selectedDate.getFullYear() === selectedYear;
      days.push(
        <button
          key={day}
          onClick={() => {
            const newDate = new Date(selectedYear, selectedMonth, day);
            onDateChange(newDate);
          }}
          className={`aspect-square flex items-center justify-center text-sm rounded-full transition-colors min-w-[40px] min-h-[40px] ${
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
          className="aspect-square flex items-center justify-center text-gray-300 text-sm hover:bg-gray-50 rounded-lg min-w-[40px] min-h-[40px]"
        >
          {i}
        </button>
      );
    }

    return days;
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-[#F4F4F4] p-3 sm:p-4 lg:p-5 rounded-xl">
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
              Time
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                value={selectedTime || ""}
                readOnly
                onClick={() => setShowTimePicker(true)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 border border-dashed border-[#DFDFDF] text-black cursor-pointer text-sm sm:text-base rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Select time"
              />
            </div>
          </div>
        </div>
      </div>

      {showTimePicker && (
        <TimePicker
          initialTime={selectedTime}
          onSelectTime={(time) => {
            onTimeChange(time);
            setShowTimePicker(false);
          }}
          onClose={() => setShowTimePicker(false)}
        />
      )}
    </>
  );
};

// Custom Radio Button Component
const CustomRadioButton: React.FC<{
  checked: boolean;
  onChange: () => void;
  name: string;
  value: string;
}> = ({ checked, onChange, name, value }) => {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
        checked
          ? "bg-purple-500 border-purple-500"
          : "bg-white border-gray-300"
      }`}
    >
      {checked && (
        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white rounded-full" />
      )}
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
    </button>
  );
};

const Review: React.FC<ReviewProps> = ({ eventId: propEventId }) => {
  const navigate = useNavigate();
  const search = useSearch({ from: "/_organizer/organizer/events/create" });
  const eventId = propEventId || (search as { eventId?: string })?.eventId || null;
  const queryClient = useQueryClient();
  
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [refundPolicyType, setRefundPolicyType] = useState<"automated" | "time_bound">("automated");
  const [refundCutoffDays, setRefundCutoffDays] = useState<string>("");
  const [publishNow, setPublishNow] = useState(true);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [scheduledTime, setScheduledTime] = useState<string>("");
  const [isChangeImageModalOpen, setIsChangeImageModalOpen] = useState(false);
  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<ApiTicket | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [isPublishSuccessModalOpen, setIsPublishSuccessModalOpen] = useState(false);
  const [publishScheduledDate, setPublishScheduledDate] = useState<Date | null>(null);
  
  // Edit event form state
  const [editEventName, setEditEventName] = useState("");
  const [editEventDescription, setEditEventDescription] = useState("");
  const [editEventLocation, setEditEventLocation] = useState("");
  const [editEventDate, setEditEventDate] = useState<Date | null>(null);
  const [editEventStartTime, setEditEventStartTime] = useState("");
  const [editEventEndTime, setEditEventEndTime] = useState("");
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  
  const mediaUploadRef = React.useRef<MediaUploadHandle>(null);
  const uploadMediaMutation = useUploadMedia();
  const updateEventMutation = useUpdateEvent();
  const createTicketMutation = useCreateTicket();
  const updateTicketMutation = useUpdateTicket();
  const deleteTicketsMutation = useDeleteTickets();
  const toggleVisibilityMutation = useToggleTicketVisibility();
  const showToast = useToastStore((state) => state.showToast);

  // Fetch event data
  const { data: eventData, isLoading: isLoadingEvent } = useGetEventById(
    eventId || "",
    !!eventId
  );

  // Fetch tickets data
  const { data: ticketsData, isLoading: isLoadingTickets } = useGetTickets(
    eventId || "",
    !!eventId
  );

  const event: Event | undefined = eventData?.data?.event || eventData?.event;
  
  // Extract tickets - handle multiple possible response structures
  let tickets: ApiTicket[] = [];
  
  // First, try to get tickets from the event object
  if (event?.tickets && Array.isArray(event.tickets)) {
    tickets = event.tickets;
  } 
  // Otherwise, try to extract from ticketsData (similar to ticketing.tsx)
  else if (ticketsData?.data) {
    // Check if it's wrapped (ApiResponse<GetTicketsResponse>)
    if (Array.isArray(ticketsData.data)) {
      tickets = ticketsData.data;
    } else if (ticketsData.data.data && Array.isArray(ticketsData.data.data)) {
      tickets = ticketsData.data.data;
    } else if (ticketsData.data.status && ticketsData.data.data && Array.isArray(ticketsData.data.data)) {
      tickets = ticketsData.data.data;
    }
  }

  // Initialize state from event data when loaded
  useEffect(() => {
    if (event) {
      if (event.visibility) {
        setVisibility(event.visibility);
      } else {
        setVisibility("public"); // Default to public
      }
      if (event.refundPolicy?.type) {
        setRefundPolicyType(event.refundPolicy.type);
        if (event.refundPolicy.cutoffDays) {
          setRefundCutoffDays(event.refundPolicy.cutoffDays.toString());
        }
      } else {
        setRefundPolicyType("automated"); // Default to automated
      }
      if (event.PublishDate) {
        const publishDate = new Date(event.PublishDate);
        setPublishNow(false);
        setScheduledDate(publishDate);
        // Extract time from ISO string
        const hours = publishDate.getHours();
        const minutes = publishDate.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        const displayHours = hours % 12 || 12;
        setScheduledTime(
          `${displayHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${ampm}`
        );
      } else {
        setPublishNow(true);
      }
    }
  }, [event]);

  // Initialize edit form when opening modal
  useEffect(() => {
    if (isEditEventModalOpen && event) {
      setEditEventName(event.name || "");
      setEditEventDescription(event.description || "");
      if (event.location) {
        setEditEventLocation(`${event.location.venue || ""}, ${event.location.address || ""}`.trim().replace(/^,\s*/, ""));
      } else {
        setEditEventLocation("");
      }
      
      // Set date and times from first occurrence
      if (event.occurrences && event.occurrences.length > 0) {
        const firstOcc = event.occurrences[0];
        if (firstOcc.date) {
          setEditEventDate(new Date(firstOcc.date));
        }
        if (firstOcc.timeSlots && firstOcc.timeSlots.length > 0) {
          const startTime = new Date(firstOcc.timeSlots[0].startAt);
          const endTime = new Date(firstOcc.timeSlots[0].endAt);
          const formatTime = (date: Date) => {
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const ampm = hours >= 12 ? "PM" : "AM";
            const displayHours = hours % 12 || 12;
            return `${displayHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${ampm}`;
          };
          setEditEventStartTime(formatTime(startTime));
          setEditEventEndTime(formatTime(endTime));
        }
      }
    }
  }, [isEditEventModalOpen, event]);

  // Handle edit event info
  const handleEditEventInfo = () => {
    setIsEditEventModalOpen(true);
  };

  const handleSaveEventInfo = async () => {
    if (!eventId || !event) return;

    if (!editEventName.trim()) {
      showToast("Event name is required", "error");
      return;
    }

    if (!editEventDate) {
      showToast("Event date is required", "error");
      return;
    }

    if (!editEventStartTime || !editEventEndTime) {
      showToast("Event start and end times are required", "error");
      return;
    }

    try {
      // Parse location
      let location = null;
      if (editEventLocation.trim()) {
        // Try to parse venue and address from location string
        const parts = editEventLocation.split(",").map(p => p.trim()).filter(Boolean);
        if (parts.length >= 2) {
          location = {
            venue: parts[0],
            address: parts.slice(1).join(", "),
            latitude: event.location?.latitude,
            longitude: event.location?.longitude,
          };
        } else {
          location = {
            venue: parts[0] || "",
            address: parts[0] || "",
            latitude: event.location?.latitude,
            longitude: event.location?.longitude,
          };
        }
      }

      // Parse times
      const parseTime = (timeStr: string) => {
        const [time, ampm] = timeStr.split(" ");
        const [hours, minutes] = time.split(":");
        let hour24 = parseInt(hours, 10);
        if (ampm === "PM" && hour24 !== 12) {
          hour24 += 12;
        } else if (ampm === "AM" && hour24 === 12) {
          hour24 = 0;
        }
        return { hours: hour24, minutes: parseInt(minutes, 10) };
      };

      const startTime = parseTime(editEventStartTime);
      const endTime = parseTime(editEventEndTime);

      const startDate = new Date(editEventDate);
      startDate.setHours(startTime.hours, startTime.minutes, 0, 0);
      
      let endDate = new Date(editEventDate);
      endDate.setHours(endTime.hours, endTime.minutes, 0, 0);
      
      // If end time is before start time, assume it's next day
      if (endDate <= startDate) {
        endDate.setDate(endDate.getDate() + 1);
      }

      // Update event
      const updateData: any = {
        name: editEventName.trim(),
        description: editEventDescription.trim(),
        ...(location && { location }),
        occurrences: [
          {
            date: editEventDate.toISOString().split("T")[0],
            timeSlots: [
              {
                startAt: startDate.toISOString(),
                endAt: endDate.toISOString(),
              },
            ],
          },
        ],
      };

      const response = await updateEventMutation.mutateAsync({
        eventId,
        data: updateData,
      });

      if (response.status) {
        showToast("Event updated successfully!", "success");
        setIsEditEventModalOpen(false);
        // Refetch event data
        queryClient.invalidateQueries({ queryKey: eventsKeys.detail(eventId) });
      }
    } catch (error) {
      console.error("Update error:", error);
      showToast("Failed to update event", "error");
    }
  };

  // Handle change image
  const handleChangeImage = () => {
    setIsChangeImageModalOpen(true);
  };

  const handleImageSave = async () => {
    if (!mediaUploadRef.current) {
      showToast("Please select an image first", "error");
      return;
    }

    if (!mediaUploadRef.current.hasImage) {
      showToast("Please select an image first", "error");
      return;
    }

    const success = await mediaUploadRef.current.uploadMedia();
    if (success) {
      setIsChangeImageModalOpen(false);
      setTimeout(() => {
        if (eventId) {
          queryClient.invalidateQueries({ queryKey: eventsKeys.detail(eventId) });
        }
      }, 500);
    }
  };

  // Handle save to draft
  const handleSaveToDraft = () => {
    showToast("Event saved to draft", "success");
    setTimeout(() => {
      navigate({ to: "/organizer" });
    }, 500);
  };

  // Handle publish
  const handlePublish = async () => {
    if (!eventId) {
      showToast("Event ID is required", "error");
      return;
    }

    if (refundPolicyType === "time_bound" && !refundCutoffDays) {
      showToast("Please enter the number of days for refund policy", "error");
      return;
    }

    if (!publishNow && (!scheduledDate || !scheduledTime)) {
      showToast("Please select a date and time for scheduling", "error");
      return;
    }

    setIsPublishing(true);
    try {
      // Prepare publish date
      let publishDate: string;
      if (publishNow) {
        publishDate = new Date().toISOString();
      } else {
        // Combine scheduled date and time
        const [time, ampm] = scheduledTime.split(" ");
        const [hours, minutes] = time.split(":");
        let hour24 = parseInt(hours, 10);
        if (ampm === "PM" && hour24 !== 12) {
          hour24 += 12;
        } else if (ampm === "AM" && hour24 === 12) {
          hour24 = 0;
        }
        const publishDateTime = new Date(scheduledDate!);
        publishDateTime.setHours(hour24, parseInt(minutes, 10), 0, 0);
        publishDate = publishDateTime.toISOString();
      }

      // Prepare update data
      const updateData: any = {
        visibility,
        refundPolicy: {
          type: refundPolicyType,
          ...(refundPolicyType === "time_bound" && {
            cutoffDays: parseInt(refundCutoffDays, 10),
          }),
        },
        PublishDate: publishDate,
      };

      const response = await updateEventMutation.mutateAsync({
        eventId,
        data: updateData,
      });

      if (response.status) {
        // Store scheduled date if not publishing now
        if (!publishNow && scheduledDate) {
          const [time, ampm] = scheduledTime.split(" ");
          const [hours, minutes] = time.split(":");
          let hour24 = parseInt(hours, 10);
          if (ampm === "PM" && hour24 !== 12) {
            hour24 += 12;
          } else if (ampm === "AM" && hour24 === 12) {
            hour24 = 0;
          }
          const scheduledDateTime = new Date(scheduledDate);
          scheduledDateTime.setHours(hour24, parseInt(minutes, 10), 0, 0);
          setPublishScheduledDate(scheduledDateTime);
        } else {
          setPublishScheduledDate(null);
        }
        // Show success modal instead of toast and auto-navigate
        setIsPublishSuccessModalOpen(true);
      }
    } catch (error) {
      console.error("Publish error:", error);
      showToast("Failed to publish event", "error");
    } finally {
      setIsPublishing(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Format time for display
  const formatTime = (timeString: string): string => {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return timeString;
    }
  };

  // Get first occurrence dates/times for display
  const getFirstOccurrence = () => {
    if (!event?.occurrences || event.occurrences.length === 0) return null;
    const firstOccurrence = event.occurrences[0];
    if (!firstOccurrence.timeSlots || firstOccurrence.timeSlots.length === 0) return null;
    return {
      date: firstOccurrence.date,
      startTime: firstOccurrence.timeSlots[0].startAt,
      endTime: firstOccurrence.timeSlots[firstOccurrence.timeSlots.length - 1].endAt,
    };
  };

  const firstOccurrence = getFirstOccurrence();

  // Calculate total quantity from tickets
  const totalQuantity = tickets.reduce((sum, ticket) => {
    if (ticket.quantityMode === "limited" && ticket.quantity) {
      return sum + ticket.quantity;
    }
    return sum;
  }, 0);

  // Ticket operations
  const handleAddTicket = () => {
    setEditingTicket(null);
    setIsTicketModalOpen(true);
  };

  const handleEditTicket = (ticket: ApiTicket) => {
    setEditingTicket(ticket);
    setIsTicketModalOpen(true);
    setDropdownOpen(null);
  };

  const handleDeleteTicket = (ticketId: string) => {
    setTicketToDelete(ticketId);
    setDeleteModalOpen(true);
    setDropdownOpen(null);
  };

  const handleConfirmDelete = async () => {
    if (!ticketToDelete || !eventId) {
      setDeleteModalOpen(false);
      return;
    }

    try {
      const response = await deleteTicketsMutation.mutateAsync({
        eventId,
        data: {
          ticketIds: [ticketToDelete],
        },
      });

      if (response.status) {
        showToast("Ticket deleted successfully", "success");
        queryClient.invalidateQueries({ queryKey: eventsKeys.tickets(eventId) });
        setTicketToDelete(null);
        setDeleteModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to delete ticket:", error);
    }
  };

  const handleMoreClick = (e: React.MouseEvent, ticketId: string) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const isMobile = window.innerWidth < 640;
    setDropdownPosition({
      top: rect.bottom + 5,
      left: isMobile ? rect.left - 180 : rect.left - 150,
    });
    setDropdownOpen(dropdownOpen === ticketId ? null : ticketId);
  };

  const handleToggleVisibility = async (ticketId: string) => {
    if (!eventId) return;
    
    const ticket = tickets.find(t => t._id === ticketId);
    if (!ticket) return;

    try {
      const response = await toggleVisibilityMutation.mutateAsync({
        eventId,
        ticketId,
        isVisible: !ticket.isVisible,
      });

      if (response.status) {
        queryClient.invalidateQueries({ queryKey: eventsKeys.tickets(eventId) });
        setDropdownOpen(null);
      }
    } catch (error) {
      console.error("Failed to toggle visibility:", error);
    }
  };

  // Ticket form handlers
  const handleSaveTicket = async (ticketData: any) => {
    if (!eventId) return;

    if (editingTicket) {
      // Update ticket
      const updateData: UpdateTicketRequest = {
        kind: ticketData.ticketType as "paid" | "free" | "donation",
        name: ticketData.ticketName.trim(),
        price: ticketData.ticketType === "paid" ? parseFloat(parseCurrency(ticketData.ticketPrice || "0")) : 0,
        currency: ticketData.ticketType === "paid" ? (ticketData.currency?.value as "NGN" | "GBP" | "USD" || "NGN") : "NGN",
        quantityMode: ticketData.ticketQuantity.value as "limited" | "unlimited",
        quantity: ticketData.ticketQuantity.value === "limited" ? parseInt(ticketData.quantity || "0", 10) : undefined,
        purchaseLimitPerUser: ticketData.purchaseLimit ? parseInt(ticketData.purchaseLimit, 10) : undefined,
        description: ticketData.description?.trim() || undefined,
      };

      try {
        const response = await updateTicketMutation.mutateAsync({
          eventId,
          ticketId: editingTicket._id,
          data: updateData,
        });

        if (response.status) {
          showToast("Ticket updated successfully", "success");
          queryClient.invalidateQueries({ queryKey: eventsKeys.tickets(eventId) });
          setIsTicketModalOpen(false);
          setEditingTicket(null);
        }
      } catch (error) {
        console.error("Failed to update ticket:", error);
      }
    } else {
      // Create ticket
      const createData: CreateTicketRequest = {
        kind: ticketData.ticketType as "paid" | "free" | "donation",
        name: ticketData.ticketName.trim(),
        price: ticketData.ticketType === "paid" ? parseFloat(parseCurrency(ticketData.ticketPrice || "0")) : 0,
        currency: ticketData.ticketType === "paid" ? (ticketData.currency?.value as "NGN" | "GBP" | "USD" || "NGN") : "NGN",
        quantityMode: ticketData.ticketQuantity.value as "limited" | "unlimited",
        quantity: ticketData.ticketQuantity.value === "limited" ? parseInt(ticketData.quantity || "0", 10) : undefined,
        purchaseLimitPerUser: ticketData.purchaseLimit ? parseInt(ticketData.purchaseLimit, 10) : undefined,
        description: ticketData.description?.trim() || undefined,
      };

      try {
        const response = await createTicketMutation.mutateAsync({
          eventId,
          data: createData,
        });

        if (response.status) {
          showToast("Ticket created successfully", "success");
          queryClient.invalidateQueries({ queryKey: eventsKeys.tickets(eventId) });
          setIsTicketModalOpen(false);
        }
      } catch (error) {
        console.error("Failed to create ticket:", error);
      }
    }
  };

  // Tickets Table Component
  const TicketsTable = () => {
    if (isLoadingTickets) {
      return (
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin h-8 w-8 text-purple-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        </div>
      );
    }

    const currencyOptions: DropdownOption[] = [
      { value: "NGN", label: "NGN - Nigerian Naira" },
      { value: "GBP", label: "GBP - British Pound" },
      { value: "USD", label: "USD - US Dollar" },
    ];

    const ticketQuantityOptions: DropdownOption[] = [
      { value: "limited", label: "Limited Quantity" },
      { value: "unlimited", label: "Unlimited Quantity" },
    ];

    // Transform API ticket to form format
    const transformTicketToForm = (ticket: ApiTicket) => {
      return {
        ticketName: ticket.name,
        ticketPrice: ticket.price?.toString() || "",
        currency: currencyOptions.find(c => c.value === ticket.currency) || currencyOptions[0],
        purchaseLimit: ticket.purchaseLimitPerUser?.toString() || "",
        ticketQuantity: ticketQuantityOptions.find(q => q.value === ticket.quantityMode) || ticketQuantityOptions[0],
        quantity: ticket.quantity?.toString() || "",
        description: ticket.description || "",
        ticketType: ticket.kind,
      };
    };

    return (
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 flex items-center justify-between border-b border-gray-200">
          <span className="text-lg font-semibold text-gray-800">
            {tickets.length} Ticket{tickets.length !== 1 ? "s" : ""}
          </span>
          {firstOccurrence && (
            <span className="text-sm text-gray-600 hidden sm:block">
              {formatDate(firstOccurrence.date)}
            </span>
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-4 md:px-6 py-3 md:py-4 bg-gray-50 border-b border-gray-200">
            <div className="col-span-3 flex items-center gap-1">
              <span className="text-sm font-medium text-gray-500">
                Ticket Name
              </span>
            </div>
            <div className="col-span-3 flex items-center gap-1">
              <span className="text-sm font-medium text-gray-500">
                Ticket Price
              </span>
            </div>
            <div className="col-span-2 flex items-center gap-1">
              <span className="text-sm font-medium text-gray-500">Quantity</span>
            </div>
            <div className="col-span-3 flex items-center gap-1">
              <span className="text-sm font-medium text-gray-500">
                Ticket Sold
              </span>
            </div>
            <div className="col-span-1"></div>
          </div>

          {/* Rows */}
          {tickets.length > 0 ? (
            tickets.map((ticket, index) => (
              <div
                key={ticket._id || index}
                className={`grid grid-cols-12 gap-4 px-4 md:px-6 py-4 md:py-5 items-center ${
                  index !== tickets.length - 1 ? "border-b border-gray-200" : ""
                }`}
              >
                <div className="col-span-3">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-800 font-medium text-sm sm:text-base">
                      {ticket.name}
                    </span>
                    {ticket.isVisible === false && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-300">
                        Hidden
                      </span>
                    )}
                  </div>
                </div>
                <div className="col-span-3">
                  <span className="text-gray-800 font-medium text-sm sm:text-base">
                    {ticket.kind === "free"
                      ? "Free"
                      : `${ticket.currency || "USD"} ${formatCurrency(ticket.price?.toString() || "0", false)}`}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-800 font-medium text-sm sm:text-base">
                    {ticket.quantityMode === "unlimited"
                      ? "Unlimited"
                      : ticket.quantity || 0}
                  </span>
                </div>
                <div className="col-span-3">
                  <span className="text-gray-800 font-medium text-sm sm:text-base">
                    {ticket.sold || 0}/
                    {ticket.quantityMode === "unlimited" ? "∞" : ticket.quantity || 0}
                  </span>
                </div>
                <div className="col-span-1 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleEditTicket(ticket)}
                    className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
                    aria-label="Edit ticket"
                  >
                    <Edit className="w-4 h-4 text-purple-600" />
                  </button>
                  <button
                    onClick={(e) => handleMoreClick(e, ticket._id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="More options"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">
              No tickets added yet.
            </div>
          )}
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden bg-white rounded-xl overflow-hidden space-y-3 p-4">
          {tickets.length > 0 ? (
            tickets.map((ticket, index) => (
              <div
                key={ticket._id || index}
                className="bg-white border-2 border-gray-200 rounded-xl p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-semibold text-gray-800 truncate">
                        {ticket.name}
                      </h3>
                      {ticket.isVisible === false && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-300">
                          Hidden
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-2 shrink-0">
                    <button
                      onClick={() => handleEditTicket(ticket)}
                      className="p-1.5 hover:bg-purple-50 rounded-lg transition-colors"
                      aria-label="Edit ticket"
                    >
                      <Edit className="w-4 h-4 text-purple-600" />
                    </button>
                    <button
                      onClick={(e) => handleMoreClick(e, ticket._id)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="More options"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Price</span>
                    <span className="text-sm font-medium text-gray-800">
                      {ticket.kind === "free"
                        ? "Free"
                        : `${ticket.currency || "USD"} ${formatCurrency(ticket.price?.toString() || "0", false)}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Quantity</span>
                    <span className="text-sm font-medium text-gray-800">
                      {ticket.quantityMode === "unlimited"
                        ? "Unlimited"
                        : ticket.quantity || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Sold</span>
                    <span className="text-sm font-medium text-gray-800">
                      {ticket.sold || 0}/
                      {ticket.quantityMode === "unlimited" ? "∞" : ticket.quantity || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">
              No tickets added yet.
            </div>
          )}
        </div>

        {/* Add Ticket Button */}
        <div className="p-4 sm:p-6 border-t border-gray-200">
          <button
            onClick={handleAddTicket}
            className="w-full py-3 sm:py-4 border-2 border-[#7417C6] text-[#7417C6] rounded-2xl hover:bg-purple-50 transition-colors font-semibold text-base sm:text-lg flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Ticket
          </button>
        </div>
      </div>
    );
  };

  if (isLoadingEvent) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin h-8 w-8 text-purple-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <p className="text-center text-gray-500">Event not found</p>
        </div>
      </div>
    );
  }

  // Get event image URL
  const eventImage = event.media?.url || "";

  // Get location display
  const locationDisplay = event.location
    ? `${event.location.venue || ""}, ${event.location.address || ""}`.trim().replace(/^,\s*/, "")
    : "Location not specified";

  // Get date/time display
  const dateDisplay = firstOccurrence
    ? event.recurrence === "recurring"
      ? `${formatDate(firstOccurrence.date)} (${event.occurrences?.length || 0} occurrences)`
      : formatDate(firstOccurrence.date)
    : "Date not set";

  const timeDisplay = firstOccurrence
    ? `${formatTime(firstOccurrence.startTime)} - ${formatTime(firstOccurrence.endTime)}`
    : "Time not set";

  return (
    <>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">
        {/* Event Summary */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-64 h-48 bg-purple-600 relative flex-shrink-0">
              {eventImage ? (
                <img
                  src={eventImage}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-white opacity-50" />
                </div>
              )}
            </div>

            <div className="flex-1 p-4 sm:p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold text-gray-800">
                  {event.name}
                </h3>
                <button
                  onClick={handleEditEventInfo}
                  className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  aria-label="Edit event"
                >
                  <Edit className="w-5 h-5" />
                </button>
              </div>

              {event.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {event.description}
                </p>
              )}

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">Date:</span>
                  <span>{dateDisplay}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">Time:</span>
                  <span>{timeDisplay}</span>
                </div>

                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="font-medium">Location:</span>
                    <span className="truncate">{locationDisplay}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Ticket2 className="w-4 h-4" />
                  <span className="font-medium">
                    {tickets.length} Ticket{tickets.length !== 1 ? "s" : ""}:
                  </span>
                  <Users className="w-4 h-4 ml-2" />
                  <span className="font-medium">Total Quantity</span>
                  <span className="font-semibold">
                    {totalQuantity > 0 ? totalQuantity : "Unlimited"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 pb-4 sm:pb-6">
            <button
              onClick={handleChangeImage}
              className="w-full md:w-auto px-6 py-2.5 border-2 border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <ImageIcon className="w-4 h-4" />
              Change Image
            </button>
          </div>
        </div>

        {/* Tickets Table */}
        <TicketsTable />

        {/* Organizer */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 space-y-4">
          <h3 className="text-base font-semibold text-gray-800">Organizer</h3>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-gray-800 font-medium">{event.organizerName || "N/A"}</p>
          </div>
        </div>

        {/* Visibility */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 space-y-4">
          <h3 className="text-base font-semibold text-gray-800">
            Event Visibility
          </h3>
          <label className="flex items-start gap-3 cursor-pointer">
            <CustomRadioButton
              checked={visibility === "public"}
              onChange={() => setVisibility("public")}
              name="visibility"
              value="public"
            />
            <div>
              <p className="font-semibold text-gray-800">Public:</p>
              <p className="text-sm text-gray-600">
                Anyone can find and buy tickets.
              </p>
            </div>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <CustomRadioButton
              checked={visibility === "private"}
              onChange={() => setVisibility("private")}
              name="visibility"
              value="private"
            />
            <div>
              <p className="font-semibold text-gray-800">Private</p>
              <p className="text-sm text-gray-600">
                Only invited guests with a special link can view.
              </p>
            </div>
          </label>
        </div>

        {/* Refund Policy */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 space-y-4">
          <h3 className="text-base font-semibold text-gray-800">Refund Policy</h3>
          <label className="flex items-start gap-3 cursor-pointer">
            <CustomRadioButton
              checked={refundPolicyType === "automated"}
              onChange={() => {
                setRefundPolicyType("automated");
                setRefundCutoffDays("");
              }}
              name="refund"
              value="automated"
            />
            <div>
              <p className="font-semibold text-gray-800">Automated Refund</p>
              <p className="text-sm text-gray-600">
                Refunds are processed automatically according to platform policies.
              </p>
            </div>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <CustomRadioButton
              checked={refundPolicyType === "time_bound"}
              onChange={() => setRefundPolicyType("time_bound")}
              name="refund"
              value="time_bound"
            />
            <div className="space-y-3 flex-1">
              <div>
                <p className="font-semibold text-gray-800">Time-Bound Refund</p>
                <p className="text-sm text-gray-600">
                  Refunds allowed up to a set number of days before the event.
                </p>
              </div>
              {refundPolicyType === "time_bound" && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Enter the number of days before the event
                  </p>
                  <input
                    type="number"
                    value={refundCutoffDays}
                    onChange={(e) => setRefundCutoffDays(e.target.value)}
                    placeholder="e.g., 7"
                    min="1"
                    className="w-full max-w-xs px-4 py-2.5 border-2 border-purple-300 rounded-xl focus:border-purple-500 focus:outline-none"
                  />
                </div>
              )}
            </div>
          </label>
        </div>

        {/* Publish Settings */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 space-y-4">
          <h3 className="text-base font-semibold text-gray-800">
            Publish Settings
          </h3>

          <label className="flex items-start gap-3 cursor-pointer">
            <CustomRadioButton
              checked={publishNow}
              onChange={() => {
                setPublishNow(true);
                setScheduledDate(null);
                setScheduledTime("");
              }}
              name="publish"
              value="now"
            />
            <div>
              <p className="font-semibold text-gray-800">Publish Now</p>
              <p className="text-sm text-gray-600">
                Make your event public immediately.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <CustomRadioButton
              checked={!publishNow}
              onChange={() => setPublishNow(false)}
              name="publish"
              value="schedule"
            />
            <div className="w-full space-y-3">
              <div>
                <p className="font-semibold text-gray-800">
                  Schedule Publish date
                </p>
                <p className="text-sm text-gray-600">
                  Pick a date/time to go live automatically.
                </p>
              </div>

              {!publishNow && (
                <div className="mt-4">
                  <CalendarPicker
                    selectedDate={scheduledDate}
                    selectedTime={scheduledTime}
                    onDateChange={setScheduledDate}
                    onTimeChange={setScheduledTime}
                  />
                </div>
              )}
            </div>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handleSaveToDraft}
              className="w-full sm:flex-1 border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-xl hover:bg-purple-50 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              Save to Draft
            </button>
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="w-full sm:flex-1 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPublishing ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Publishing...
                </>
              ) : (
                "Publish Event"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Edit Event Info Modal */}
      <Modal
        isOpen={isEditEventModalOpen}
        onClose={() => setIsEditEventModalOpen(false)}
        title="Edit Event Information"
        size="md"
      >
        <div className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editEventName}
              onChange={(e) => setEditEventName(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              placeholder="Enter event name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={editEventDescription}
              onChange={(e) => setEditEventDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
              placeholder="Enter event description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <GooglePlacesAutocomplete
              value={editEventLocation}
              onChange={setEditEventLocation}
              placeholder="Enter location"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={editEventDate ? editEventDate.toISOString().split("T")[0] : ""}
              onChange={(e) => setEditEventDate(e.target.value ? new Date(e.target.value) : null)}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={editEventStartTime}
                  readOnly
                  onClick={() => setShowStartTimePicker(true)}
                  className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none cursor-pointer"
                  placeholder="Select start time"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={editEventEndTime}
                  readOnly
                  onClick={() => setShowEndTimePicker(true)}
                  className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none cursor-pointer"
                  placeholder="Select end time"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => setIsEditEventModalOpen(false)}
              className="flex-1 px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEventInfo}
              disabled={updateEventMutation.isPending}
              className="flex-1 px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateEventMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {showStartTimePicker && (
          <TimePicker
            initialTime={editEventStartTime}
            onSelectTime={(time) => {
              setEditEventStartTime(time);
              setShowStartTimePicker(false);
            }}
            onClose={() => setShowStartTimePicker(false)}
          />
        )}

        {showEndTimePicker && (
          <TimePicker
            initialTime={editEventEndTime}
            onSelectTime={(time) => {
              setEditEventEndTime(time);
              setShowEndTimePicker(false);
            }}
            onClose={() => setShowEndTimePicker(false)}
          />
        )}
      </Modal>

      {/* Change Image Modal - Mobile First & Responsive */}
      <Modal
        isOpen={isChangeImageModalOpen}
        onClose={() => setIsChangeImageModalOpen(false)}
        title="Change Event Image"
        size="md"
      >
        <div className="p-4 sm:p-6">
          <div className="w-full">
            <MediaUpload
              ref={mediaUploadRef}
              eventId={eventId}
              onMediaUploaded={(url) => {
                console.log("Media uploaded:", url);
              }}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
            <button
              onClick={() => setIsChangeImageModalOpen(false)}
              className="w-full sm:flex-1 px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleImageSave}
              disabled={
                uploadMediaMutation.isPending ||
                !mediaUploadRef.current?.hasImage
              }
              className="w-full sm:flex-1 px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadMediaMutation.isPending
                ? "Saving..."
                : mediaUploadRef.current?.hasImage
                ? "Save Image"
                : "Select Image First"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Ticket Modal - Reuse TicketDetailsForm from ticketing */}
      {isTicketModalOpen && (
        <TicketModal
          isOpen={isTicketModalOpen}
          onClose={() => {
            setIsTicketModalOpen(false);
            setEditingTicket(null);
          }}
          onSave={handleSaveTicket}
          editingTicket={editingTicket}
          isLoading={createTicketMutation.isPending || updateTicketMutation.isPending}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setTicketToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete This Ticket"
        description={
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 md:mb-8 px-2 sm:px-4 leading-relaxed">
            If you delete this ticket, it will be permanently removed from your
            event. All information attached to it including ticket name, price,
            availability, attendee registrations, and any related settings will
            also be deleted. This action cannot be undone.
          </p>
        }
      />

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <TicketOptionsDropdown
          isOpen={true}
          onClose={() => setDropdownOpen(null)}
          onEdit={() => {
            const ticket = tickets.find(t => t._id === dropdownOpen);
            if (ticket) {
              handleEditTicket(ticket);
            }
          }}
          onDuplicate={() => {
            if (dropdownOpen) {
              handleDeleteTicket(dropdownOpen);
            }
          }}
          onHide={() => {
            if (dropdownOpen) {
              handleToggleVisibility(dropdownOpen);
            }
          }}
          position={dropdownPosition}
          isVisible={tickets.find(t => t._id === dropdownOpen)?.isVisible !== false}
        />
      )}

      {/* Publish Success Modal */}
      <Modal
        isOpen={isPublishSuccessModalOpen}
        onClose={() => setIsPublishSuccessModalOpen(false)}
        title=""
        size="xl"
        showCloseButton={false}
        closeOnOverlayClick={false}
      >
        <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 items-center py-4 sm:py-6 md:py-8 px-2 sm:px-4">
          {/* Success Icon */}
          <div className="bg-[#ddf5eb] rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center shadow-lg flex-shrink-0">
            <BadgeCheck className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[#17b26a]" />
          </div>

          {/* Success Message */}
          <div className="flex flex-col gap-1.5 sm:gap-2 items-center text-center">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-[#2d2d2d] leading-tight sm:leading-[28px] md:leading-[32px] lg:leading-[40px] px-2">
              {publishScheduledDate ? "Event Scheduled for Publication" : "Event Published Successfully!"}
            </h2>
            {publishScheduledDate ? (
              <p className="text-sm sm:text-base md:text-lg font-medium text-[#5a5a5a] leading-[20px] sm:leading-[24px] md:leading-[26px] tracking-[0.09px] max-w-[515px] px-2">
                Your event has been scheduled to be published on{" "}
                <span className="font-semibold text-[#2d2d2d]">
                  {formatDate(publishScheduledDate.toISOString())} at {formatTime(publishScheduledDate.toISOString())}
                </span>
                . It will automatically go live at the scheduled time.
              </p>
            ) : (
              <p className="text-sm sm:text-base md:text-lg font-medium text-[#5a5a5a] leading-[20px] sm:leading-[24px] md:leading-[26px] tracking-[0.09px] max-w-[515px] px-2">
                Your event has been published and is now live! Attendees can now discover and purchase tickets for your event.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full mt-2 sm:mt-0">
            <CustomButton
              title="Request Vendors"
              onClick={() => {
                setIsPublishSuccessModalOpen(false);
                navigate({ to: "/organizer/request-vendors" });
              }}
              className="flex-1 h-12 sm:h-14 md:h-[70px] px-4 sm:px-8 md:px-12 py-3 sm:py-4 border-2 border-[#7417c6] bg-[#f1e8f9] text-[#7417c6] rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg font-medium leading-[20px] sm:leading-[24px] md:leading-[26px] tracking-[0.09px] hover:bg-[#e8d5f3] disabled:bg-[#f1e8f9] shadow-none transition-colors"
            />
            <CustomButton
              title="Go to Dashboard"
              onClick={() => {
                setIsPublishSuccessModalOpen(false);
                navigate({ to: "/organizer" });
              }}
              className="flex-1 h-12 sm:h-14 md:h-[70px] px-4 sm:px-8 md:px-12 py-3 sm:py-4 bg-[#17b26a] text-white rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg font-semibold leading-[20px] sm:leading-[24px] md:leading-[26px] tracking-[0.09px] hover:bg-[#15a05f] disabled:bg-[#17b26a] transition-colors"
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

// Ticket Modal Component (simplified version)
const TicketModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editingTicket: ApiTicket | null;
  isLoading: boolean;
}> = ({ isOpen, onClose, onSave, editingTicket, isLoading }) => {
  const [ticketType, setTicketType] = useState<"paid" | "free" | "donation">(
    editingTicket?.kind || "paid"
  );
  const [ticketName, setTicketName] = useState(editingTicket?.name || "");
  const [ticketPrice, setTicketPrice] = useState(editingTicket?.price?.toString() || "");
  const [currency, setCurrency] = useState<DropdownOption>(
    editingTicket?.currency
      ? { value: editingTicket.currency, label: `${editingTicket.currency} - ${editingTicket.currency === "NGN" ? "Nigerian Naira" : editingTicket.currency === "GBP" ? "British Pound" : "US Dollar"}` }
      : { value: "NGN", label: "NGN - Nigerian Naira" }
  );
  const [purchaseLimit, setPurchaseLimit] = useState(editingTicket?.purchaseLimitPerUser?.toString() || "");
  const [quantityMode, setQuantityMode] = useState<DropdownOption>(
    editingTicket?.quantityMode === "unlimited"
      ? { value: "unlimited", label: "Unlimited Quantity" }
      : { value: "limited", label: "Limited Quantity" }
  );
  const [quantity, setQuantity] = useState(editingTicket?.quantity?.toString() || "");
  const [description, setDescription] = useState(editingTicket?.description || "");

  const currencyOptions: DropdownOption[] = [
    { value: "NGN", label: "NGN - Nigerian Naira" },
    { value: "GBP", label: "GBP - British Pound" },
    { value: "USD", label: "USD - US Dollar" },
  ];

  const quantityOptions: DropdownOption[] = [
    { value: "limited", label: "Limited Quantity" },
    { value: "unlimited", label: "Unlimited Quantity" },
  ];

  const handleSave = () => {
    onSave({
      ticketType,
      ticketName,
      ticketPrice,
      currency,
      purchaseLimit,
      ticketQuantity: quantityMode,
      quantity,
      description,
    });
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingTicket ? "Edit Ticket" : "Add New Ticket"}
      size="lg"
    >
      <div className="p-4 sm:p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ticket Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={ticketName}
            onChange={(e) => setTicketName(e.target.value)}
            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            placeholder="Enter ticket name"
          />
        </div>

        {ticketType === "paid" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency <span className="text-red-500">*</span>
                </label>
                <DropdownInput
                  options={currencyOptions}
                  value={currency}
                  onChange={setCurrency}
                  placeholder="Select currency"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={ticketPrice ? formatCurrency(ticketPrice, false) : ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.]/g, "");
                    setTicketPrice(value);
                  }}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="0.00"
                />
              </div>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Purchase Limit Per User
          </label>
          <input
            type="text"
            value={purchaseLimit}
            onChange={(e) => setPurchaseLimit(e.target.value)}
            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            placeholder="e.g., 5"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity Mode
            </label>
            <DropdownInput
              options={quantityOptions}
              value={quantityMode}
              onChange={setQuantityMode}
              placeholder="Select mode"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity {quantityMode.value === "limited" && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              disabled={quantityMode.value === "unlimited"}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none disabled:opacity-50"
              placeholder={quantityMode.value === "unlimited" ? "Unlimited" : "e.g., 100"}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            maxLength={1000}
            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
            placeholder="Enter description..."
          />
          <p className="text-xs text-gray-500 mt-1">{description.length}/1000</p>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-6 py-2.5 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : "Save Ticket"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Ticket Options Dropdown Component
const TicketOptionsDropdown: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onHide: () => void;
  position: { top: number; left: number };
  isVisible?: boolean;
}> = ({ isOpen, onClose, onEdit, onDuplicate, onHide, position, isVisible = true }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getPosition = () => {
    if (typeof window === 'undefined') return position;
    const isMobile = window.innerWidth < 640;
    if (isMobile) {
      return {
        top: Math.min(position.top, window.innerHeight - 200),
        left: Math.max(8, Math.min(position.left, window.innerWidth - 208)),
      };
    }
    return position;
  };

  return (
    <div
      ref={dropdownRef}
      className="fixed bg-white rounded-2xl shadow-lg border-2 border-purple-200 py-2 z-50 min-w-[180px] sm:min-w-[200px]"
      style={{
        top: `${getPosition().top}px`,
        left: `${getPosition().left}px`,
      }}
    >
      <button
        onClick={onEdit}
        className="w-full flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 transition-colors text-left"
      >
        <Edit className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 shrink-0" />
        <span className="text-gray-900 font-medium text-base sm:text-lg">Edit</span>
      </button>
      <button
        onClick={onHide}
        className="w-full flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 transition-colors text-left"
      >
        {isVisible ? (
          <>
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0L12 12m-5.71-5.71L12 12" />
            </svg>
            <span className="text-gray-900 font-medium text-base sm:text-lg">Hide Ticket</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-gray-900 font-medium text-base sm:text-lg">Show Ticket</span>
          </>
        )}
      </button>
      <button
        onClick={onDuplicate}
        className="w-full flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 transition-colors text-left"
      >
        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 shrink-0" />
        <span className="text-gray-900 font-medium text-base sm:text-lg">Delete</span>
      </button>
    </div>
  );
};

export default Review;
