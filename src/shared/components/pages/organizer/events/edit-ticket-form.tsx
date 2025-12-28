import React, { useState, useEffect } from "react";
import { useGetTickets, useUpdateTicket } from "@/shared/api/services/events/events.hooks";
import { useToastStore } from "@/shared/stores/toast-store";
import { useNavigate } from "@tanstack/react-router";
import Ticketing, { Ticket } from "./ticketing";
import type { UpdateTicketRequest } from "@/shared/api/services/events/types";
import { updateTicketSchema } from "@/shared/forms/schemas/events.schema";
import {
  DropdownInput,
  DropdownOption,
} from "../../../accessories/dropdown-input";

interface EditTicketFormProps {
  eventId: string;
  ticketId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

const EditTicketForm: React.FC<EditTicketFormProps> = ({
  eventId,
  ticketId,
  onCancel,
  onSuccess,
}) => {
  const { data: ticketsData, isLoading } = useGetTickets(eventId);
  const updateTicketMutation = useUpdateTicket();
  const showToast = useToastStore((state) => state.showToast);
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [formData, setFormData] = useState({
    ticketName: "",
    ticketPrice: "",
    currency: null as DropdownOption | null,
    purchaseLimit: "",
    ticketQuantity: null as DropdownOption | null,
    quantity: "",
    description: "",
    ticketType: "",
  });

  // Currency options
  const currencyOptions: DropdownOption[] = [
    { value: "NGN", label: "NGN - Nigerian Naira" },
    { value: "GBP", label: "GBP - British Pound" },
    { value: "USD", label: "USD - US Dollar" },
  ];

  // Ticket quantity options
  const ticketQuantityOptions: DropdownOption[] = [
    { value: "limited", label: "Limited Quantity" },
    { value: "unlimited", label: "Unlimited Quantity" },
  ];

  // Load ticket data
  useEffect(() => {
    if (ticketsData?.data?.data && ticketsData.data.data.length > 0) {
      const foundTicket = ticketsData.data.data.find((t) => t._id === ticketId);
      if (foundTicket) {
        // Transform API ticket to local Ticket format
        const localTicket: Ticket = {
          id: foundTicket._id || ticketId,
          ticketName: foundTicket.name,
          ticketPrice: foundTicket.price.toString(),
          currency:
            currencyOptions.find((c) => c.value === foundTicket.currency) ||
            currencyOptions[0],
          purchaseLimit: foundTicket.purchaseLimitPerUser?.toString() || "",
          ticketQuantity:
            ticketQuantityOptions.find(
              (q) => q.value === foundTicket.quantityMode
            ) || ticketQuantityOptions[0],
          quantity: foundTicket.quantity?.toString() || "",
          description: foundTicket.description || "",
          ticketType: foundTicket.kind,
          ticketsSold: foundTicket.sold || 0,
          apiTicketId: foundTicket._id,
        };
        setTicket(localTicket);
        setFormData({
          ticketName: localTicket.ticketName,
          ticketPrice: localTicket.ticketPrice,
          currency: localTicket.currency,
          purchaseLimit: localTicket.purchaseLimit,
          ticketQuantity: localTicket.ticketQuantity,
          quantity: localTicket.quantity,
          description: localTicket.description,
          ticketType: localTicket.ticketType,
        });
      } else {
        showToast("Ticket not found", "error");
        onCancel();
      }
    }
  }, [ticketsData, ticketId, onCancel, showToast]);

  const handleSave = async () => {
    if (!ticket) return;

    // Transform to API format
    const parsedPrice = parseFloat(formData.ticketPrice.replace(/,/g, "") || "0");
    const quantity = parseInt(formData.quantity || "0", 10);
    const purchaseLimit = parseInt(formData.purchaseLimit || "0", 10);

    const updateData: UpdateTicketRequest = {
      kind: formData.ticketType as "paid" | "free" | "donation",
      name: formData.ticketName.trim(),
      price: formData.ticketType === "paid" || formData.ticketType === "donation" ? parsedPrice : 0,
      currency:
        formData.ticketType === "paid" || formData.ticketType === "donation"
          ? (formData.currency?.value as "NGN" | "GBP" | "USD" || "NGN")
          : "NGN",
      quantityMode: formData.ticketQuantity?.value as "limited" | "unlimited",
      quantity: formData.ticketQuantity?.value === "limited" ? quantity : undefined,
      purchaseLimitPerUser: purchaseLimit > 0 ? purchaseLimit : undefined,
      description: formData.description?.trim() || undefined,
    };

    // Validate
    try {
      await updateTicketSchema.validate(updateData, { abortEarly: false });
    } catch (error: any) {
      const errors = error.errors || [error.message];
      showToast(errors.join(", "), "error");
      return;
    }

    // Update ticket
    try {
      const response = await updateTicketMutation.mutateAsync({
        eventId,
        ticketId,
        data: updateData,
      });

      if (response.status) {
        showToast("Ticket updated successfully", "success");
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to update ticket:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600">Loading ticket data...</div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600">Ticket not found</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-4 flex-wrap mb-6 sm:mb-8">
        <button
          onClick={onCancel}
          className="border border-[#eaeaea] px-3 py-2 sm:py-[14px] rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium text-[#777] hover:bg-gray-50 transition-colors"
        >
          Go back
        </button>
        <button className="bg-[#f1e8f9] px-3 sm:px-[14px] py-2 sm:py-[14px] rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold text-[#2d2d2d]">
          Edit Ticket
        </button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg p-6 space-y-6">
        {/* Ticket Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter Ticket Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.ticketName}
            onChange={(e) =>
              setFormData({ ...formData, ticketName: e.target.value })
            }
            className="w-full text-gray-700 px-4 py-3 border-2 border-dashed rounded-lg bg-gray-50 focus:outline-none focus:bg-white transition-colors border-gray-300 focus:border-purple-400"
            placeholder="Enter ticket name"
          />
        </div>

        {/* Ticket Price and Currency - Only for Paid/Donation Ticket */}
        {(formData.ticketType === "paid" || formData.ticketType === "donation") && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency <span className="text-red-500">*</span>
              </label>
              <DropdownInput
                options={currencyOptions}
                value={formData.currency}
                onChange={(option: DropdownOption) =>
                  setFormData({ ...formData, currency: option })
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
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600">
                  {formData.currency?.value === "NGN"
                    ? "₦"
                    : formData.currency?.value === "GBP"
                    ? "£"
                    : formData.currency?.value === "USD"
                    ? "$"
                    : "$"}
                </span>
                <input
                  type="text"
                  value={formData.ticketPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  onChange={(e) => {
                    let inputValue = e.target.value.replace(/[^0-9.]/g, "");
                    const parts = inputValue.split(".");
                    if (parts.length > 2) {
                      inputValue = parts[0] + "." + parts.slice(1).join("");
                    }
                    if (parts.length === 2 && parts[1].length > 2) {
                      inputValue = parts[0] + "." + parts[1].substring(0, 2);
                    }
                    setFormData({ ...formData, ticketPrice: inputValue });
                  }}
                  className="w-full text-gray-700 pl-8 pr-4 py-3 border-2 border-dashed rounded-lg bg-gray-50 focus:outline-none focus:bg-white transition-colors border-gray-300 focus:border-purple-400"
                  placeholder="0.00"
                />
              </div>
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
            onChange={(e) =>
              setFormData({ ...formData, purchaseLimit: e.target.value })
            }
            className="w-full text-gray-700 px-4 py-3 border-2 border-dashed rounded-lg bg-gray-50 focus:outline-none focus:bg-white transition-colors border-gray-300 focus:border-purple-400"
            placeholder="e.g., 5"
          />
        </div>

        {/* Ticket Quantity */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <DropdownInput
              label="Ticket Quantity"
              options={ticketQuantityOptions}
              value={formData.ticketQuantity}
              onChange={(option: DropdownOption) =>
                setFormData({ ...formData, ticketQuantity: option })
              }
              placeholder="Select ticket quantity"
              className="w-full mb-[30px]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Ticket Quantities{" "}
              {formData.ticketQuantity?.value === "limited" && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <input
              type="text"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              disabled={formData.ticketQuantity?.value === "unlimited"}
              className={`w-full text-gray-700 px-4 py-3 border-2 border-dashed rounded-lg bg-gray-50 focus:outline-none focus:bg-white transition-colors ${
                formData.ticketQuantity?.value === "unlimited"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              } border-gray-300 focus:border-purple-400`}
              placeholder={
                formData.ticketQuantity?.value === "unlimited"
                  ? "Unlimited"
                  : "e.g., 100"
              }
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter Ticket Description (this may include benefits)
          </label>
          <textarea
            rows={5}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            maxLength={1000}
            className="w-full text-gray-700 px-4 py-3 border-2 border-dashed rounded-lg bg-gray-50 focus:outline-none focus:bg-white transition-colors resize-none border-gray-300 focus:border-purple-400"
            placeholder="Enter description..."
          />
          <span className="text-xs text-gray-500 mt-1 block text-right">
            {formData.description.length}/1000
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={onCancel}
            disabled={updateTicketMutation.isPending}
            className="flex-1 px-6 py-3 border-2 border-[#7417C6] text-[#7417C6] rounded-lg hover:bg-purple-50 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={updateTicketMutation.isPending}
            className="flex-1 px-6 py-3 bg-[#7417C6] text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {updateTicketMutation.isPending ? (
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
                Updating...
              </>
            ) : (
              "Update Ticket"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTicketForm;

