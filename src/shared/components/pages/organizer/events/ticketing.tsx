import React, { useState, useRef, useEffect } from "react";
import {
  DollarSign,
  Hand,
  Heart,
  Trash2,
  MoreVertical,
  Edit,
  Copy,
  EyeOff,
  Eye,
} from "lucide-react";
import { useSearch } from "@tanstack/react-router";
import Modal from "../../../accessories/main-modal";
import {
  DropdownInput,
  DropdownOption,
} from "../../../accessories/dropdown-input";
import img from "@assets/circle.png";
import DeleteConfirmationModal from "../../../accessories/delete-confirmation-modal";
import { useCreateTicket, useUpdateTicket, useDeleteTickets, useGetTickets, useToggleTicketVisibility } from "@/shared/api/services/events/events.hooks";
import { eventsKeys } from "@/shared/api/services/events/events.hooks";
import type { CreateTicketRequest, UpdateTicketRequest } from "@/shared/api/services/events/types";
import { createTicketSchema, updateTicketSchema } from "@/shared/forms/schemas/events.schema";
import { useToastStore } from "@/shared/stores/toast-store";
import { useQueryClient } from "@tanstack/react-query";

// Utility functions for currency formatting
const formatCurrency = (value: string | number, includeDecimals: boolean = true): string => {
  // Remove any existing commas and parse the number
  const numValue = typeof value === "string" ? value.replace(/,/g, "") : value.toString();
  const num = parseFloat(numValue);
  
  if (isNaN(num) || numValue === "") {
    return "";
  }
  
  // Format with commas
  if (includeDecimals) {
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } else {
    // Check if the original value has decimal places
    const hasDecimals = numValue.includes(".");
    return num.toLocaleString("en-US", {
      minimumFractionDigits: hasDecimals ? 2 : 0,
      maximumFractionDigits: 2,
    });
  }
};

const parseCurrency = (value: string): string => {
  // Remove commas and return the numeric string
  return value.replace(/,/g, "");
};

// Ticket interface
export interface Ticket {
  id: string;
  ticketName: string;
  ticketPrice: string;
  currency: DropdownOption;
  purchaseLimit: string;
  ticketQuantity: DropdownOption;
  quantity: string;
  description: string;
  ticketType: string;
  ticketsSold: number;
  apiTicketId?: string; // Store the API ticket ID after creation
  isVisible?: boolean; // Ticket visibility status (default: true)
}

// Dropdown Menu Component
const TicketOptionsDropdown: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onHide: () => void;
  position: { top: number; left: number };
  isVisible?: boolean; // Current visibility state
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

  // Calculate responsive position (adjust for mobile)
  const getPosition = () => {
    if (typeof window === 'undefined') return position;
    const isMobile = window.innerWidth < 640;
    if (isMobile) {
      // Center on mobile or adjust to fit screen
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
        onClick={onDuplicate}
        className="w-full flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 transition-colors text-left"
      >
        <Copy className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 shrink-0" />
        <span className="text-gray-900 font-medium text-base sm:text-lg">Duplicate</span>
      </button>
      <button
        onClick={onHide}
        className="w-full flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 transition-colors text-left"
      >
        {isVisible ? (
          <>
            <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 shrink-0" />
            <span className="text-gray-900 font-medium text-base sm:text-lg">Hide Ticket</span>
          </>
        ) : (
          <>
            <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 shrink-0" />
            <span className="text-gray-900 font-medium text-base sm:text-lg">Show Ticket</span>
          </>
        )}
      </button>
    </div>
  );
};

// Ticket Type Selector Component
const TicketTypeSelector: React.FC<{
  selectedTicketType: string;
  onTicketTypeChange: (type: string) => void;
  ticketTypes: Array<{
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    iconBgColor: string;
  }>;
}> = ({ selectedTicketType, onTicketTypeChange, ticketTypes }) => {
  return (
    <div className="mb-6">
      <p className="text-base sm:text-lg font-medium text-[#5a5a5a] leading-6 mb-4">
        Enter Ticket Types
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {ticketTypes.map((ticket) => {
          const Icon = ticket.icon;
          const isSelected = selectedTicketType === ticket.id;

          return (
            <button
              key={ticket.id}
              onClick={() => onTicketTypeChange(ticket.id)}
              className={`flex items-center gap-2 px-3 py-3 rounded-xl border-2 border-dashed transition-all ${
                isSelected
                  ? "bg-[#f1e8f9] border-[#d5b9ee]"
                  : "bg-white border-[#dfdfdf] hover:border-gray-400"
              }`}
            >
              <div className={`w-7 h-7 rounded-full ${ticket.iconBgColor} flex items-center justify-center`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-[#2d2d2d] leading-5 flex-1 min-w-0 text-left truncate">
                {ticket.label}
              </span>
              {isSelected && (
                <div className="w-4 h-4 shrink-0">
                  <img src={img} alt="" className="w-full h-full" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Ticket Details Form Component
const TicketDetailsForm: React.FC<{
  ticketType: string;
  onCancel: () => void;
  onSave: (ticket: Omit<Ticket, "id" | "ticketsSold">) => void;
  editingTicket?: Ticket | null;
  isLoading?: boolean;
  onTicketTypeChange?: (type: string) => void;
  ticketTypes?: Array<{
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    iconBgColor: string;
  }>;
}> = ({ ticketType, onCancel, onSave, editingTicket, isLoading = false, onTicketTypeChange, ticketTypes }) => {
  // Define ticket quantity options
  const ticketQuantityOptions: DropdownOption[] = [
    { value: "limited", label: "Limited Quantity" },
    { value: "unlimited", label: "Unlimited Quantity" },
  ];

  // Define currency options
  const currencyOptions: DropdownOption[] = [
    { value: "NGN", label: "NGN - Nigerian Naira" },
    { value: "GBP", label: "GBP - British Pound" },
    { value: "USD", label: "USD - US Dollar" },
  ];

  const [formData, setFormData] = useState({
    ticketName: editingTicket?.ticketName || "",
    ticketPrice: editingTicket?.ticketPrice || "",
    currency: editingTicket?.currency || currencyOptions[0],
    purchaseLimit: editingTicket?.purchaseLimit || "",
    ticketQuantity: editingTicket?.ticketQuantity || ticketQuantityOptions[0],
    quantity: editingTicket?.quantity || "",
    description: editingTicket?.description || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validate form data
  const validateField = (field: string) => {
    const fieldErrors: Record<string, string> = {};

    // Ticket Name validation
    if (field === "ticketName" || field === "all") {
      if (!formData.ticketName.trim()) {
        fieldErrors.ticketName = "Ticket name is required";
      } else if (formData.ticketName.trim().length < 2) {
        fieldErrors.ticketName = "Ticket name must be at least 2 characters";
      } else if (formData.ticketName.trim().length > 100) {
        fieldErrors.ticketName = "Ticket name must be less than 100 characters";
      }
    }

    // Price validation (for paid/donation tickets)
    if ((field === "ticketPrice" || field === "all") && (ticketType === "paid" || ticketType === "donation")) {
      const parsedPrice = parseCurrency(formData.ticketPrice || "");
      if (!parsedPrice.trim()) {
        fieldErrors.ticketPrice = "Price is required";
      } else {
        const price = parseFloat(parsedPrice);
        if (isNaN(price)) {
          fieldErrors.ticketPrice = "Price must be a valid number";
        } else if (price < 0) {
          fieldErrors.ticketPrice = "Price must be 0 or greater";
        } else if (price > 1000000) {
          fieldErrors.ticketPrice = "Price must be less than 1,000,000";
        }
      }
    }

    // Quantity validation (for limited quantity mode)
    if ((field === "quantity" || field === "all") && formData.ticketQuantity.value === "limited") {
      if (!formData.quantity.trim()) {
        fieldErrors.quantity = "Quantity is required for limited tickets";
      } else {
        const qty = parseInt(formData.quantity, 10);
        if (isNaN(qty)) {
          fieldErrors.quantity = "Quantity must be a valid number";
        } else if (qty < 1) {
          fieldErrors.quantity = "Quantity must be at least 1";
        } else if (qty > 1000000) {
          fieldErrors.quantity = "Quantity must be less than 1,000,000";
        }
      }
    }

    // Purchase Limit validation
    if (field === "purchaseLimit" || field === "all") {
      if (formData.purchaseLimit.trim()) {
        const limit = parseInt(formData.purchaseLimit, 10);
        if (isNaN(limit)) {
          fieldErrors.purchaseLimit = "Purchase limit must be a valid number";
        } else if (limit < 1) {
          fieldErrors.purchaseLimit = "Purchase limit must be at least 1";
        } else if (limit > 1000) {
          fieldErrors.purchaseLimit = "Purchase limit must be less than 1000";
        }
      }
    }

    // Description validation
    if ((field === "description" || field === "all") && formData.description) {
      if (formData.description.length > 1000) {
        fieldErrors.description = "Description must be less than 1000 characters";
      }
    }

    if (field === "all") {
      setErrors(fieldErrors);
      return Object.keys(fieldErrors).length === 0;
    } else {
      setErrors((prev) => ({ ...prev, ...fieldErrors }));
      return !fieldErrors[field];
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const handleChange = (field: string, value: any) => {
    // For ticketPrice, parse the value to remove commas before storing
    if (field === "ticketPrice") {
      const parsedValue = parseCurrency(value);
      setFormData((prev) => ({ ...prev, [field]: parsedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
    
    if (touched[field]) {
      validateField(field);
    }
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSave = () => {
    // Validate all fields
    if (!validateField("all")) {
      // Mark all fields as touched to show errors
      setTouched({
        ticketName: true,
        ticketPrice: true,
        purchaseLimit: true,
        quantity: true,
        description: true,
      });
      return;
    }

    onSave({
      ...formData,
      ticketType,
    });
    // Don't call onCancel here - let the parent handle it after API call
  };

  const showPriceField = ticketType === "paid" || ticketType === "donation";

  // Show "Coming soon" for donation tickets
  if (ticketType === "donation") {
    return (
      <div className="space-y-6">
        {/* Ticket Type Selector - only show when not editing */}
        {onTicketTypeChange && ticketTypes && !editingTicket && (
          <TicketTypeSelector
            selectedTicketType={ticketType}
            onTicketTypeChange={onTicketTypeChange}
            ticketTypes={ticketTypes}
          />
        )}

        {/* Coming Soon Message */}
        <div className="flex flex-col items-center justify-center py-8 sm:py-12">
          <p className="text-center text-base sm:text-lg text-gray-500 font-medium">
            Coming Soon
          </p>
          <p className="text-center text-xs sm:text-sm text-gray-400 mt-2">
            Donation ticket details will be available soon
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="w-full sm:flex-1 px-4 sm:px-6 py-3 border-2 border-[#7417C6] text-[#7417C6] rounded-lg hover:bg-purple-50 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Ticket Type Selector - only show when not editing */}
      {onTicketTypeChange && ticketTypes && !editingTicket && (
        <TicketTypeSelector
          selectedTicketType={ticketType}
          onTicketTypeChange={onTicketTypeChange}
          ticketTypes={ticketTypes}
        />
      )}

      {/* Ticket Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter Ticket Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.ticketName}
          onChange={(e) => handleChange("ticketName", e.target.value)}
          onBlur={() => handleBlur("ticketName")}
          className={`w-full text-gray-700 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-dashed rounded-lg bg-gray-50 focus:outline-none focus:bg-white transition-colors ${
            errors.ticketName
              ? "border-red-500 focus:border-red-500"
              : "border-gray-300 focus:border-purple-400"
          }`}
          placeholder="Enter ticket name"
          disabled={isLoading}
        />
        {errors.ticketName && touched.ticketName && (
          <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.ticketName}</p>
        )}
      </div>

      {/* Ticket Price and Currency - Only for Paid/Donation Ticket */}
      {showPriceField && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency <span className="text-red-500">*</span>
            </label>
            <DropdownInput
              options={currencyOptions}
              value={formData.currency}
              onChange={(option: DropdownOption) =>
                handleChange("currency", option)
              }
              placeholder="Select currency"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Ticket Price <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-600 text-sm sm:text-base">
                {formData.currency.value === "NGN" ? "₦" : formData.currency.value === "GBP" ? "£" : formData.currency.value === "USD" ? "$" : "$"}
              </span>
              <input
                type="text"
                value={formData.ticketPrice ? formatCurrency(formData.ticketPrice, false) : ""}
                onChange={(e) => {
                  // Allow only numbers and decimal point
                  let inputValue = e.target.value.replace(/[^0-9.]/g, "");
                  // Prevent multiple decimal points
                  const parts = inputValue.split(".");
                  if (parts.length > 2) {
                    inputValue = parts[0] + "." + parts.slice(1).join("");
                  }
                  // Limit decimal places to 2
                  if (parts.length === 2 && parts[1].length > 2) {
                    inputValue = parts[0] + "." + parts[1].substring(0, 2);
                  }
                  handleChange("ticketPrice", inputValue);
                }}
                onBlur={() => {
                  handleBlur("ticketPrice");
                  // Format on blur to ensure proper formatting with 2 decimal places
                  if (formData.ticketPrice) {
                    const parsed = parseCurrency(formData.ticketPrice);
                    const num = parseFloat(parsed);
                    if (!isNaN(num)) {
                      setFormData((prev) => ({
                        ...prev,
                        ticketPrice: num.toFixed(2),
                      }));
                    }
                  }
                }}
                className={`w-full text-gray-700 pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-dashed rounded-lg bg-gray-50 focus:outline-none focus:bg-white transition-colors ${
                  errors.ticketPrice
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-purple-400"
                }`}
                placeholder="0.00"
                disabled={isLoading}
              />
            </div>
            {errors.ticketPrice && touched.ticketPrice && (
              <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.ticketPrice}</p>
            )}
          </div>
        </div>
      )}

      {/* Purchase Limit */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Purchase Limit Per User
        </label>
        <input
          type="text"
          value={formData.purchaseLimit}
          onChange={(e) => handleChange("purchaseLimit", e.target.value)}
          onBlur={() => handleBlur("purchaseLimit")}
          className={`w-full text-gray-700 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-dashed rounded-lg bg-gray-50 focus:outline-none focus:bg-white transition-colors ${
            errors.purchaseLimit
              ? "border-red-500 focus:border-red-500"
              : "border-gray-300 focus:border-purple-400"
          }`}
          placeholder="e.g., 5"
          disabled={isLoading}
        />
        {errors.purchaseLimit && touched.purchaseLimit && (
          <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.purchaseLimit}</p>
        )}
      </div>

      {/* Ticket Quantity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <DropdownInput
            label="Ticket Quantity"
            options={ticketQuantityOptions}
            value={formData.ticketQuantity}
            onChange={(option: DropdownOption) =>
              setFormData({ ...formData, ticketQuantity: option })
            }
            placeholder="Select ticket quantity"
            className="w-full mb-0 sm:mb-[30px]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Ticket Quantities{" "}
            {formData.ticketQuantity.value === "limited" && (
              <span className="text-red-500">*</span>
            )}
          </label>
          <input
            type="text"
            value={formData.quantity}
            onChange={(e) => handleChange("quantity", e.target.value)}
            onBlur={() => handleBlur("quantity")}
            disabled={
              formData.ticketQuantity.value === "unlimited" || isLoading
            }
            className={`w-full text-gray-700 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-dashed rounded-lg bg-gray-50 focus:outline-none focus:bg-white transition-colors ${
              formData.ticketQuantity.value === "unlimited"
                ? "opacity-50 cursor-not-allowed"
                : ""
            } ${
              errors.quantity
                ? "border-red-500 focus:border-red-500"
                : "border-gray-300 focus:border-purple-400"
            }`}
            placeholder={
              formData.ticketQuantity.value === "unlimited"
                ? "Unlimited"
                : "e.g., 100"
            }
          />
          {errors.quantity && touched.quantity && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.quantity}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter Ticket Description (this may include benefits)
        </label>
        <div className="relative">
          <textarea
            rows={5}
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            onBlur={() => handleBlur("description")}
            maxLength={1000}
            disabled={isLoading}
            className={`w-full text-gray-700 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-dashed rounded-lg bg-gray-50 focus:outline-none focus:bg-white transition-colors resize-none ${
              errors.description
                ? "border-red-500 focus:border-red-500"
                : "border-gray-300 focus:border-purple-400"
            }`}
            placeholder="Enter description..."
          />
          <span
            className={`absolute bottom-2 sm:bottom-3 right-2 sm:right-3 text-xs ${
              formData.description.length > 1000
                ? "text-red-600"
                : "text-gray-500"
            }`}
          >
            {formData.description.length}/1000
          </span>
          {errors.description && touched.description && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.description}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="w-full sm:flex-1 px-4 sm:px-6 py-3 border-2 border-[#7417C6] text-[#7417C6] rounded-lg hover:bg-purple-50 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="w-full sm:flex-1 px-4 sm:px-6 py-3 bg-[#7417C6] text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          {isLoading ? (
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
              {editingTicket ? "Updating..." : "Creating..."}
            </>
          ) : (
            "Save Ticket"
          )}
        </button>
      </div>
    </div>
  );
};

// Main Ticketing Component
interface TicketingProps {
  selectedTicketType: string;
  setSelectedTicketType: (type: string) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  onNext: () => void;
  onTicketsChange?: (tickets: Ticket[]) => void; // New prop to pass tickets to parent
  eventId?: string | null; // Event ID for API calls
}

const Ticketing: React.FC<TicketingProps> = ({
  selectedTicketType,
  setSelectedTicketType,
  isModalOpen,
  setIsModalOpen,
  onNext: _onNext, // Unused but kept for interface compatibility
  onTicketsChange, // New prop
  eventId: propEventId,
}) => {
  const search = useSearch({ from: "/_organizer/organizer/events/create" });
  // Use eventId from props, fallback to query params
  const eventId = propEventId || (search as { eventId?: string })?.eventId || null;
  
  const [savedTickets, setSavedTickets] = useState<Ticket[]>([]);
  const [showTicketTypes, setShowTicketTypes] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const queryClient = useQueryClient();
  const createTicketMutation = useCreateTicket();
  const updateTicketMutation = useUpdateTicket();
  const deleteTicketsMutation = useDeleteTickets();
  const toggleVisibilityMutation = useToggleTicketVisibility();
  const showToast = useToastStore((state) => state.showToast);
  
  // Fetch existing tickets when eventId is available
  const { data: ticketsData, isLoading: isLoadingTickets } = useGetTickets(
    eventId || "",
    !!eventId
  );

  // Helper function to invalidate tickets query
  const invalidateTickets = () => {
    if (eventId) {
      queryClient.invalidateQueries({
        queryKey: eventsKeys.tickets(eventId),
      });
      setHasLoadedTickets(false); // Reset to trigger refetch
    }
  };

  // State persistence key
  const STORAGE_KEY = eventId ? `ticket-state-${eventId}` : null;
  const [hasLoadedTickets, setHasLoadedTickets] = useState(false);

  // Load tickets from API when data is available
  useEffect(() => {
    if (!eventId || isLoadingTickets || !ticketsData) return;
    
    // Check both possible response structures
    // API returns: { status, message, data: [...] }
    // So ticketsData.data is the GetTicketsResponse which has { status, message, data: Ticket[] }
    // Or ticketsData.data.data if wrapped in ApiResponse
    let ticketsArray: any[] = [];
    if (ticketsData?.data) {
      // Check if it's wrapped (ApiResponse<GetTicketsResponse>)
      if (Array.isArray(ticketsData.data)) {
        ticketsArray = ticketsData.data;
      } else if (ticketsData.data.data && Array.isArray(ticketsData.data.data)) {
        ticketsArray = ticketsData.data.data;
      } else if (ticketsData.data.status && ticketsData.data.data && Array.isArray(ticketsData.data.data)) {
        ticketsArray = ticketsData.data.data;
      }
    }
    
    // Transform API tickets to local format
    const currencyOptions: DropdownOption[] = [
      { value: "NGN", label: "NGN - Nigerian Naira" },
      { value: "GBP", label: "GBP - British Pound" },
      { value: "USD", label: "USD - US Dollar" },
    ];
    const ticketQuantityOptions: DropdownOption[] = [
      { value: "limited", label: "Limited Quantity" },
      { value: "unlimited", label: "Unlimited Quantity" },
    ];

    if (!Array.isArray(ticketsArray) || ticketsArray.length === 0) {
      // No tickets from API, show ticket type selection
      setSavedTickets([]);
      setShowTicketTypes(true);
      setHasLoadedTickets(true);
      return;
    }

    // Transform tickets
    const transformedTickets: Ticket[] = ticketsArray.map((apiTicket: any) => {
      return {
        id: apiTicket._id || Date.now().toString(),
        ticketName: apiTicket.name,
        ticketPrice: apiTicket.price.toString(),
        currency:
          currencyOptions.find((c) => c.value === apiTicket.currency) ||
          currencyOptions[0],
        purchaseLimit: apiTicket.purchaseLimitPerUser?.toString() || "",
        ticketQuantity:
          ticketQuantityOptions.find(
            (q) => q.value === apiTicket.quantityMode
          ) || ticketQuantityOptions[0],
        quantity: apiTicket.quantity?.toString() || "",
        description: apiTicket.description || "",
        ticketType: apiTicket.kind,
        ticketsSold: apiTicket.sold || 0,
        apiTicketId: apiTicket._id,
        isVisible: apiTicket.isVisible !== undefined ? apiTicket.isVisible : true, // Default to true if not provided
      };
    });

    // Check if tickets have actually changed by comparing IDs
    const currentTicketIds = savedTickets.map(t => t.apiTicketId).sort().join(',');
    const newTicketIds = transformedTickets.map(t => t.apiTicketId).sort().join(',');
    
    // Only update if tickets have changed
    if (currentTicketIds !== newTicketIds || !hasLoadedTickets) {
      setSavedTickets(transformedTickets);
      setShowTicketTypes(false);
      setHasLoadedTickets(true);
    }
  }, [ticketsData, eventId, isLoadingTickets]);

  // Persist state to localStorage whenever tickets change (but only after initial load)
  useEffect(() => {
    if (STORAGE_KEY && eventId && hasLoadedTickets) {
      try {
        const stateToSave = {
          tickets: savedTickets,
          showTicketTypes,
          timestamp: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
      } catch (error) {
        console.error("Failed to save ticket state:", error);
      }
    }
  }, [savedTickets, showTicketTypes, STORAGE_KEY, eventId, hasLoadedTickets]);

  // Notify parent of ticket changes
  useEffect(() => {
    onTicketsChange?.(savedTickets);
  }, [savedTickets, onTicketsChange]);

  const ticketTypes = [
    {
      id: "paid",
      label: "Paid Ticket",
      icon: DollarSign,
      iconBgColor: "bg-green-500",
      description: "Charge attendees for tickets",
    },
    {
      id: "free",
      label: "Free Ticket",
      icon: Hand,
      iconBgColor: "bg-blue-500",
      description: "Allow free registration",
    },
    {
      id: "donation",
      label: "Donation",
      icon: Heart,
      iconBgColor: "bg-pink-500",
      description: "Accept donations from attendees",
    },
  ];

  /**
   * Transform local ticket format to API format
   */
  const transformTicketToAPI = (
    ticketData: Omit<Ticket, "id" | "ticketsSold">
  ): CreateTicketRequest => {
    // Parse price value to ensure no commas are sent to backend
    const parsedPriceValue = parseCurrency(ticketData.ticketPrice || "0");
    const price = parseFloat(parsedPriceValue);
    const quantity = parseInt(ticketData.quantity || "0", 10);
    const purchaseLimit = parseInt(ticketData.purchaseLimit || "0", 10);

    return {
      kind: ticketData.ticketType as "paid" | "free" | "donation",
      name: ticketData.ticketName.trim(),
      price: ticketData.ticketType === "paid" || ticketData.ticketType === "donation" ? price : 0,
      currency: ticketData.ticketType === "paid" || ticketData.ticketType === "donation" 
        ? (ticketData.currency?.value as "NGN" | "GBP" | "USD" || "NGN")
        : "NGN",
      quantityMode: ticketData.ticketQuantity.value as "limited" | "unlimited",
      quantity: ticketData.ticketQuantity.value === "limited" ? quantity : undefined,
      purchaseLimitPerUser: purchaseLimit > 0 ? purchaseLimit : undefined,
      description: ticketData.description?.trim() || undefined,
    };
  };

  /**
   * Validate ticket data using Yup schema
   */
  const validateTicketData = async (ticketData: CreateTicketRequest): Promise<boolean> => {
    try {
      await createTicketSchema.validate(ticketData, { abortEarly: false });
      return true;
    } catch (error: any) {
      const errors = error.errors || [error.message];
      showToast(errors.join(", "), "error");
      return false;
    }
  };

  const handleSaveTicket = async (ticketData: Omit<Ticket, "id" | "ticketsSold">) => {
    // If editing, update via API
    if (editingTicket && editingTicket.apiTicketId && eventId) {
      const apiTicketData = transformTicketToAPI(ticketData);
      
      // Validate update data
      try {
        await updateTicketSchema.validate(apiTicketData, { abortEarly: false });
      } catch (error: any) {
        const errors = error.errors || [error.message];
        showToast(errors.join(", "), "error");
        return;
      }

      try {
        const response = await updateTicketMutation.mutateAsync({
          eventId,
          ticketId: editingTicket.apiTicketId,
          data: apiTicketData as UpdateTicketRequest,
        });

      if (response.status) {
        // Reset the loaded flag so tickets will be refetched
        setHasLoadedTickets(false);
        setEditingTicket(null);
        setShowTicketTypes(false);
        setIsModalOpen(false);
        // Success toast is handled by the hook
      }
      } catch (error) {
        // Error toast is handled by the hook
        console.error("Failed to update ticket:", error);
      }
      return;
    } else if (editingTicket && !editingTicket.apiTicketId) {
      // If editing a local-only ticket (no API ID), just update locally
      setSavedTickets(
        savedTickets.map((ticket) =>
          ticket.id === editingTicket.id
            ? {
                ...ticketData,
                id: editingTicket.id,
                ticketsSold: editingTicket.ticketsSold,
              }
            : ticket
        )
      );
      setEditingTicket(null);
      setShowTicketTypes(false);
      setIsModalOpen(false);
      return;
    }

    // For new tickets, create via API if eventId is available
    if (!eventId) {
      // If no eventId yet, just save locally (will be created later)
      const newTicket: Ticket = {
        ...ticketData,
        id: Date.now().toString(),
        ticketsSold: 0,
      };
      setSavedTickets([...savedTickets, newTicket]);
      setShowTicketTypes(false);
      setIsModalOpen(false);
      return;
    }

    // Transform to API format
    const apiTicketData = transformTicketToAPI(ticketData);

    // Validate
    const isValid = await validateTicketData(apiTicketData);
    if (!isValid) {
      return; // Error toast already shown
    }

    // Create ticket via API
    try {
      const response = await createTicketMutation.mutateAsync({
        eventId,
        data: apiTicketData,
      });

      if (response.status) {
        // Invalidate and refetch tickets
        invalidateTickets();
        setShowTicketTypes(false);
        setIsModalOpen(false);
        // Success toast is handled by the hook
      }
    } catch (error) {
      // Error toast is handled by the hook
      console.error("Failed to create ticket:", error);
    }
  };

  const handleDeleteClick = (id: string) => {
    setTicketToDelete(id);
    setDeleteModalOpen(true);
    setDropdownOpen(null);
  };

  const handleConfirmDelete = async () => {
    if (!ticketToDelete || !eventId) {
      setDeleteModalOpen(false);
      return;
    }

    const ticket = savedTickets.find((t) => t.id === ticketToDelete);
    if (!ticket) {
      setDeleteModalOpen(false);
      return;
    }

    // If ticket has API ID, delete via API
    if (ticket.apiTicketId) {
      try {
        const response = await deleteTicketsMutation.mutateAsync({
          eventId,
          data: {
            ticketIds: [ticket.apiTicketId],
          },
        });

        if (response.status) {
          // Reset the loaded flag so tickets will be refetched
          setHasLoadedTickets(false);
          setTicketToDelete(null);
          setDeleteModalOpen(false);
          // Success toast is handled by the hook
        }
      } catch (error) {
        // Error toast is handled by the hook
        console.error("Failed to delete ticket:", error);
      }
    } else {
      // If no API ID, just remove locally
      setSavedTickets(
        savedTickets.filter((ticket) => ticket.id !== ticketToDelete)
      );
      setTicketToDelete(null);
      setDeleteModalOpen(false);
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

  const handleEdit = (ticketId: string) => {
    const ticket = savedTickets.find((t) => t.id === ticketId);
    if (ticket) {
      // Always open modal with ticket details prefilled
      setEditingTicket(ticket);
      setSelectedTicketType(ticket.ticketType);
      setIsModalOpen(true);
      setDropdownOpen(null);
    }
  };

  const handleDuplicate = async (ticketId: string) => {
    const ticket = savedTickets.find((t) => t.id === ticketId);
    if (!ticket) {
      setDropdownOpen(null);
      return;
    }

    // Invalidate tickets query
    invalidateTickets();

    // Create a duplicate ticket data
    const duplicatedTicketData: Omit<Ticket, "id" | "ticketsSold"> = {
      ...ticket,
      ticketName: `${ticket.ticketName} (Copy)`,
    };

    // If eventId is available, create via API
    if (eventId) {
      const apiTicketData = transformTicketToAPI(duplicatedTicketData);

      // Validate
      const isValid = await validateTicketData(apiTicketData);
      if (!isValid) {
        setDropdownOpen(null);
        return;
      }

      try {
        const response = await createTicketMutation.mutateAsync({
          eventId,
          data: apiTicketData,
        });

        if (response.status) {
          // Reset the loaded flag so tickets will be refetched
          setHasLoadedTickets(false);
          setDropdownOpen(null);
          // Success toast is handled by the hook
        }
      } catch (error) {
        // Error toast is handled by the hook
        console.error("Failed to duplicate ticket:", error);
      }
    } else {
      // If no eventId, just add locally
      const duplicatedTicket: Ticket = {
        ...duplicatedTicketData,
        id: Date.now().toString(),
        ticketsSold: 0,
      };
      setSavedTickets([...savedTickets, duplicatedTicket]);
      setDropdownOpen(null);
    }
  };

  /**
   * Toggle ticket visibility
   */
  const handleHide = async (ticketId: string) => {
    const ticket = savedTickets.find((t) => t.id === ticketId);
    if (!ticket || !ticket.apiTicketId || !eventId) {
      setDropdownOpen(null);
      return;
    }

    // Get current visibility state and toggle it
    const currentVisibility = ticket.isVisible !== undefined ? ticket.isVisible : true;
    const newVisibility = !currentVisibility;

    try {
      const response = await toggleVisibilityMutation.mutateAsync({
        eventId,
        ticketId: ticket.apiTicketId,
        isVisible: newVisibility,
      });

      if (response.status) {
        // Reset the loaded flag so tickets will be refetched
        setHasLoadedTickets(false);
        setDropdownOpen(null);
      }
    } catch (error) {
      console.error("Failed to toggle ticket visibility:", error);
      showToast("Failed to update ticket visibility", "error");
      setDropdownOpen(null);
    }
  };

  const handleAddTicket = () => {
    setEditingTicket(null);
    setShowTicketTypes(true);
    setIsModalOpen(true);
    // Reset to default ticket type when adding new ticket
    setSelectedTicketType("paid");
  };

  // Show loading state while fetching tickets
  if (isLoadingTickets && eventId) {
    return (
      <div className="bg-white p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-600">Loading tickets...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-3 sm:p-4 md:p-6">
      <div className="mx-auto bg-white">
        {/* Show ticket types selection or saved tickets */}
        {savedTickets.length > 0 ? (
          <>
            {/* Saved Tickets Display - Show when tickets exist */}
            <div className="bg-gray-50 rounded-2xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="px-4 sm:px-6 py-2 sm:py-3 bg-white border-2 border-purple-300 rounded-full text-center sm:text-left">
                    <span className="text-gray-700 font-semibold text-sm sm:text-base">
                      {savedTickets.length} Ticket
                      {savedTickets.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-end gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white border-2 border-gray-200 rounded-full">
                    <span className="text-gray-700 font-semibold text-sm sm:text-base">
                      10 January 2025
                    </span>
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Table - Desktop View */}
                <div className="hidden md:block bg-white rounded-xl overflow-hidden">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 px-4 md:px-6 py-3 md:py-4 bg-gray-50 border-b border-gray-200">
                    <div className="col-span-3 flex items-center gap-1">
                      <span className="text-sm font-medium text-gray-500">
                        Ticket Name
                      </span>
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                        />
                      </svg>
                    </div>
                    <div className="col-span-3 flex items-center gap-1">
                      <span className="text-sm font-medium text-gray-500">
                        Ticket Price
                      </span>
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                        />
                      </svg>
                    </div>
                    <div className="col-span-2 flex items-center gap-1">
                      <span className="text-sm font-medium text-gray-500">
                        Quantity
                      </span>
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                        />
                      </svg>
                    </div>
                    <div className="col-span-3 flex items-center gap-1">
                      <span className="text-sm font-medium text-gray-500">
                        Ticket Sold
                      </span>
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                        />
                      </svg>
                    </div>
                    <div className="col-span-1"></div>
                  </div>

                  {/* Table Rows */}
                  {savedTickets.map((ticket, index) => (
                    <div
                      key={ticket.id}
                      className={`grid grid-cols-12 gap-4 px-4 md:px-6 py-4 md:py-5 items-center ${
                        index !== savedTickets.length - 1
                          ? "border-b border-gray-200"
                          : ""
                      }`}
                    >
                      <div className="col-span-3">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-800 font-medium text-sm sm:text-base">
                            {ticket.ticketName}
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
                          {ticket.currency?.value === "NGN" ? "₦" : ticket.currency?.value === "GBP" ? "£" : ticket.currency?.value === "USD" ? "$" : "$"}
                          {formatCurrency(ticket.ticketPrice || "0")}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-800 font-medium text-sm sm:text-base">
                          {ticket.quantity}
                        </span>
                      </div>
                      <div className="col-span-3">
                        <span className="text-gray-800 font-medium text-sm sm:text-base">
                          {ticket.ticketsSold}/{ticket.quantity}
                        </span>
                      </div>
                      <div className="col-span-1 flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDeleteClick(ticket.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Delete ticket"
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                        </button>
                        <button
                          onClick={(e) => handleMoreClick(e, ticket.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          aria-label="More options"
                        >
                          <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden bg-white rounded-xl overflow-hidden space-y-3">
                  {savedTickets.map((ticket, index) => (
                    <div
                      key={ticket.id}
                      className={`bg-white border-2 border-gray-200 rounded-xl p-4 ${
                        index !== savedTickets.length - 1 ? "" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-semibold text-gray-800 truncate">
                              {ticket.ticketName}
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
                            onClick={() => handleDeleteClick(ticket.id)}
                            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Delete ticket"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                          <button
                            onClick={(e) => handleMoreClick(e, ticket.id)}
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
                            {ticket.currency?.value === "NGN" ? "₦" : ticket.currency?.value === "GBP" ? "£" : ticket.currency?.value === "USD" ? "$" : "$"}
                            {formatCurrency(ticket.ticketPrice || "0")}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Quantity</span>
                          <span className="text-sm font-medium text-gray-800">
                            {ticket.quantity}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Sold</span>
                          <span className="text-sm font-medium text-gray-800">
                            {ticket.ticketsSold}/{ticket.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            {/* Add Ticket Button */}
            <button
              onClick={handleAddTicket}
              className="w-full py-3 sm:py-4 border-2 border-[#7417C6] text-[#7417C6] rounded-2xl hover:bg-purple-50 transition-colors font-semibold text-base sm:text-lg flex items-center justify-center gap-2"
            >
              Add Ticket
              <span className="text-xl sm:text-2xl">+</span>
            </button>
          </>
        ) : (
          <>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 sm:mb-6">
              Enter Ticket Types
            </h3>

            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {ticketTypes.map((ticket) => {
                const Icon = ticket.icon;
                const isSelected = selectedTicketType === ticket.id;

                return (
                  <button
                    key={ticket.id}
                    onClick={() => setSelectedTicketType(ticket.id)}
                    className={`w-full flex items-center justify-between p-4 sm:p-6 rounded-2xl transition-all cursor-pointer ${
                      isSelected
                        ? "bg-purple-50 border-2 border-purple-400"
                        : "bg-white border-2 border-dashed border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full ${ticket.iconBgColor} flex items-center justify-center shrink-0`}
                      >
                        <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </div>
                      <span className="text-base sm:text-xl font-semibold text-gray-800">
                        {ticket.label}
                      </span>
                    </div>

                    {isSelected && (
                      <img src={img} alt="" className="w-6 h-6 sm:w-8 sm:h-8 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {selectedTicketType === "donation" && (
              <p className="text-center text-xs sm:text-sm text-gray-500 mt-2">
                Donation ticket details coming soon
              </p>
            )}
          </>
        )}
      </div>

      {/* Ticket Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTicket(null);
          if (savedTickets.length > 0) {
            setShowTicketTypes(false);
          }
        }}
        title={editingTicket ? "Edit Ticket Details" : "Add New Ticket Details"}
        size="lg"
        animationDuration={300}
      >
        <TicketDetailsForm
          ticketType={selectedTicketType}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingTicket(null);
            if (savedTickets.length > 0) {
              setShowTicketTypes(false);
            }
          }}
          onSave={handleSaveTicket}
          editingTicket={editingTicket}
          isLoading={
            createTicketMutation.isPending || updateTicketMutation.isPending
          }
          onTicketTypeChange={(type) => {
            setSelectedTicketType(type);
            // Reset form data when switching ticket types (unless editing)
            if (!editingTicket) {
              // Clear any form errors when switching types
            }
          }}
          ticketTypes={ticketTypes}
        />
      </Modal>

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
      <TicketOptionsDropdown
        isOpen={dropdownOpen !== null}
        onClose={() => setDropdownOpen(null)}
        onEdit={() => dropdownOpen && handleEdit(dropdownOpen)}
        onDuplicate={() => dropdownOpen && handleDuplicate(dropdownOpen)}
        onHide={() => dropdownOpen && handleHide(dropdownOpen)}
        position={dropdownPosition}
        isVisible={dropdownOpen ? (savedTickets.find((t) => t.id === dropdownOpen)?.isVisible !== false) : true}
      />
    </div>
  );
};

export default Ticketing;
