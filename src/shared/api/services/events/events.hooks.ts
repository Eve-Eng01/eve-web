/**
 * Events Hooks (TanStack Query)
 * React Query hooks for event operations
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { eventsService } from "./events.service";
import type {
  CreateDraftEventRequest,
  UploadMediaRequest,
  CreateTicketRequest,
  UpdateTicketRequest,
  DeleteTicketsRequest,
  UpdateEventRequest,
  AddVendorServicesRequest,
} from "./types";
import { useToastStore } from "../../../stores/toast-store";
import { extractErrorMessage } from "./events-error-handler";

/**
 * Query Keys
 */
export const eventsKeys = {
  all: ["events"] as const,
  lists: () => [...eventsKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...eventsKeys.lists(), filters] as const,
  details: () => [...eventsKeys.all, "detail"] as const,
  detail: (id: string) => [...eventsKeys.details(), id] as const,
  tickets: (eventId: string) =>
    [...eventsKeys.detail(eventId), "tickets"] as const,
  userTickets: (eventId: string) =>
    [...eventsKeys.detail(eventId), "tickets", "user"] as const,
};

/**
 * Create Draft Event Mutation
 */
export function useCreateDraftEvent() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: (data: CreateDraftEventRequest) =>
      eventsService.createDraft(data),
    onSuccess: (response) => {
      if (response.status) {
        showToast(
          response.message || "Draft event created successfully",
          "success"
        );
        // Invalidate events list to refetch
        queryClient.invalidateQueries({ queryKey: eventsKeys.lists() });
      }
    },
    onError: (error) => {
      console.error("Create draft event error:", error);
      const errorMessage = extractErrorMessage(error);
      showToast(errorMessage, "error");
    },
  });
}

/**
 * Upload Media Mutation
 */
export function useUploadMedia() {
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: ({ eventId, file }: { eventId: string; file: File }) =>
      eventsService.uploadMedia(eventId, file),
    onSuccess: (response) => {
      if (response.status) {
        showToast(
          response.message || "Media uploaded successfully",
          "success"
        );
      }
    },
    onError: (error) => {
      console.error("Upload media error:", error);
      const errorMessage = extractErrorMessage(error);
      showToast(errorMessage, "error");
    },
  });
}

/**
 * Create Ticket Mutation
 */
export function useCreateTicket() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: ({
      eventId,
      data,
    }: {
      eventId: string;
      data: CreateTicketRequest;
    }) => eventsService.createTicket(eventId, data),
    onSuccess: (response, variables) => {
      if (response.status) {
        showToast(
          response.message || "Ticket created successfully",
          "success"
        );
        // Invalidate tickets query
        queryClient.invalidateQueries({
          queryKey: eventsKeys.tickets(variables.eventId),
        });
        // Invalidate event detail to refresh ticket list
        queryClient.invalidateQueries({
          queryKey: eventsKeys.detail(variables.eventId),
        });
      }
    },
    onError: (error) => {
      console.error("Create ticket error:", error);
      const errorMessage = extractErrorMessage(error);
      showToast(errorMessage, "error");
    },
  });
}

/**
 * Update Ticket Mutation
 */
export function useUpdateTicket() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: ({
      eventId,
      ticketId,
      data,
    }: {
      eventId: string;
      ticketId: string;
      data: UpdateTicketRequest;
    }) => eventsService.updateTicket(eventId, ticketId, data),
    onSuccess: (response, variables) => {
      if (response.status) {
        showToast(
          response.message || "Ticket updated successfully",
          "success"
        );
        // Invalidate tickets query
        queryClient.invalidateQueries({
          queryKey: eventsKeys.tickets(variables.eventId),
        });
        // Invalidate event detail
        queryClient.invalidateQueries({
          queryKey: eventsKeys.detail(variables.eventId),
        });
      }
    },
    onError: (error) => {
      console.error("Update ticket error:", error);
      const errorMessage = extractErrorMessage(error);
      showToast(errorMessage, "error");
    },
  });
}

/**
 * Delete Tickets Mutation
 */
export function useDeleteTickets() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: ({
      eventId,
      data,
    }: {
      eventId: string;
      data: DeleteTicketsRequest;
    }) => eventsService.deleteTickets(eventId, data),
    onSuccess: (response, variables) => {
      if (response.status) {
        showToast(
          response.message || "Tickets deleted successfully",
          "success"
        );
        // Invalidate tickets query
        queryClient.invalidateQueries({
          queryKey: eventsKeys.tickets(variables.eventId),
        });
        // Invalidate event detail
        queryClient.invalidateQueries({
          queryKey: eventsKeys.detail(variables.eventId),
        });
      }
    },
    onError: (error) => {
      console.error("Delete tickets error:", error);
      const errorMessage = extractErrorMessage(error);
      showToast(errorMessage, "error");
    },
  });
}

/**
 * Get Tickets Query
 */
export function useGetTickets(eventId: string, enabled = true) {
  return useQuery({
    queryKey: eventsKeys.tickets(eventId),
    queryFn: () => eventsService.getTickets(eventId),
    enabled: enabled && !!eventId,
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Get Tickets For User Query
 */
export function useGetTicketsForUser(eventId: string, enabled = true) {
  return useQuery({
    queryKey: eventsKeys.userTickets(eventId),
    queryFn: () => eventsService.getTicketsForUser(eventId),
    enabled: enabled && !!eventId,
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Toggle Ticket Visibility Mutation
 */
export function useToggleTicketVisibility() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: ({
      eventId,
      ticketId,
      isVisible,
    }: {
      eventId: string;
      ticketId: string;
      isVisible: boolean;
    }) => eventsService.toggleTicketVisibility(eventId, ticketId, isVisible),
    onSuccess: (response, variables) => {
      if (response.status) {
        showToast(
          response.message || `Ticket ${variables.isVisible ? "shown" : "hidden"} successfully`,
          "success"
        );
        // Invalidate tickets query
        queryClient.invalidateQueries({
          queryKey: eventsKeys.tickets(variables.eventId),
        });
        // Invalidate event detail
        queryClient.invalidateQueries({
          queryKey: eventsKeys.detail(variables.eventId),
        });
      }
    },
    onError: (error) => {
      console.error("Toggle ticket visibility error:", error);
      const errorMessage = extractErrorMessage(error);
      showToast(errorMessage, "error");
    },
  });
}

/**
 * Update Event Mutation
 */
export function useUpdateEvent() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: ({
      eventId,
      data,
    }: {
      eventId: string;
      data: UpdateEventRequest;
    }) => eventsService.updateEvent(eventId, data),
    onSuccess: (response, variables) => {
      if (response.status) {
        showToast(
          response.message || "Event updated successfully",
          "success"
        );
        // Invalidate event detail
        queryClient.invalidateQueries({
          queryKey: eventsKeys.detail(variables.eventId),
        });
        // Invalidate events list
        queryClient.invalidateQueries({ queryKey: eventsKeys.lists() });
      }
    },
    onError: (error) => {
      console.error("Update event error:", error);
      const errorMessage = extractErrorMessage(error);
      showToast(errorMessage, "error");
    },
  });
}

/**
 * Get Event By ID Query
 */
export function useGetEventById(eventId: string, enabled = true) {
  return useQuery({
    queryKey: eventsKeys.detail(eventId),
    queryFn: () => eventsService.getEventById(eventId),
    enabled: enabled && !!eventId,
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Get User Events Query
 */
export function useGetUserEvents(enabled = true) {
  return useQuery({
    queryKey: eventsKeys.lists(),
    queryFn: () => eventsService.getUserEvents(),
    enabled,
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Get User Events By Status Query
 * Fetches events filtered by status (draft, scheduled, published, completed)
 */
export function useGetUserEventsByStatus(
  status: "draft" | "scheduled" | "published" | "completed",
  enabled = true
) {
  return useQuery({
    queryKey: eventsKeys.list({ status }),
    queryFn: () => eventsService.getUserEvents(status),
    enabled,
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Mark Event Completed Mutation
 */
export function useMarkEventCompleted() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: (eventId: string) =>
      eventsService.markEventCompleted(eventId),
    onSuccess: (response, eventId) => {
      if (response.status) {
        showToast(
          response.message || "Event marked as completed",
          "success"
        );
        // Invalidate event detail
        queryClient.invalidateQueries({
          queryKey: eventsKeys.detail(eventId),
        });
        // Invalidate events list
        queryClient.invalidateQueries({ queryKey: eventsKeys.lists() });
      }
    },
    onError: (error) => {
      console.error("Mark event completed error:", error);
      const errorMessage = extractErrorMessage(error);
      showToast(errorMessage, "error");
    },
  });
}

/**
 * Delete Event Mutation
 */
export function useDeleteEvent() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: (eventId: string) => eventsService.deleteEvent(eventId),
    onSuccess: (response) => {
      if (response.status) {
        showToast(
          response.message || "Event deleted successfully",
          "success"
        );
        // Invalidate events list
        queryClient.invalidateQueries({ queryKey: eventsKeys.lists() });
      }
    },
    onError: (error) => {
      console.error("Delete event error:", error);
      const errorMessage = extractErrorMessage(error);
      showToast(errorMessage, "error");
    },
  });
}

/**
 * Add Vendor Services Mutation
 */
export function useAddVendorServices() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: ({
      eventId,
      data,
    }: {
      eventId: string;
      data: AddVendorServicesRequest;
    }) => eventsService.addVendorServices(eventId, data),
    onSuccess: (response, variables) => {
      if (response.status) {
        showToast(
          response.message || "Vendor services added successfully",
          "success"
        );
        // Invalidate event detail
        queryClient.invalidateQueries({
          queryKey: eventsKeys.detail(variables.eventId),
        });
      }
    },
    onError: (error) => {
      console.error("Add vendor services error:", error);
      const errorMessage = extractErrorMessage(error);
      showToast(errorMessage, "error");
    },
  });
}

