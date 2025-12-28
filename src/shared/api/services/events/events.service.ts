/**
 * Events Service
 * API service functions for event endpoints
 */

import { apiClient } from "../../client";
import type {
  CreateDraftEventRequest,
  CreateDraftEventApiResponse,
  UploadMediaApiResponse,
  CreateTicketRequest,
  CreateTicketApiResponse,
  UpdateTicketRequest,
  UpdateTicketApiResponse,
  DeleteTicketsRequest,
  DeleteTicketsApiResponse,
  GetTicketsApiResponse,
  UpdateEventRequest,
  UpdateEventApiResponse,
  GetEventByIdApiResponse,
  GetUserEventsApiResponse,
  MarkEventCompletedApiResponse,
  DeleteEventApiResponse,
  AddVendorServicesRequest,
  AddVendorServicesApiResponse,
} from "./types";

/**
 * Events Service Endpoints
 */
export const eventsService = {
  /**
   * Create a draft event
   * POST /event/
   */
  createDraft: async (
    data: CreateDraftEventRequest
  ): Promise<CreateDraftEventApiResponse> => {
    try {
      const response = await apiClient.post<CreateDraftEventApiResponse>(
        "/event/",
        data
      );
      return response.data;
    } catch (error: unknown) {
      // Enhanced error handling
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: unknown } };
        throw axiosError.response?.data || error;
      }
      throw error;
    }
  },

  /**
   * Upload media to an event
   * POST /event/:eventId/media
   */
  uploadMedia: async (
    eventId: string,
    file: File
  ): Promise<UploadMediaApiResponse> => {
    try {
      // Validate file
      if (!file) {
        throw new Error("File is required");
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error("File size must be less than 10MB");
      }

      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        throw new Error("File must be an image (JPEG, PNG, GIF, or WebP)");
      }

      const formData = new FormData();
      formData.append("media", file);

      const response = await apiClient.post<UploadMediaApiResponse>(
        `/event/${eventId}/media`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: unknown } };
        throw axiosError.response?.data || error;
      }
      throw error;
    }
  },

  /**
   * Create a ticket for an event
   * POST /event/:eventId/tickets
   */
  createTicket: async (
    eventId: string,
    data: CreateTicketRequest
  ): Promise<CreateTicketApiResponse> => {
    try {
      const response = await apiClient.post<CreateTicketApiResponse>(
        `/event/${eventId}/tickets`,
        data
      );
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: unknown } };
        throw axiosError.response?.data || error;
      }
      throw error;
    }
  },

  /**
   * Update a ticket
   * PATCH /event/:eventId/tickets/:ticketId
   */
  updateTicket: async (
    eventId: string,
    ticketId: string,
    data: UpdateTicketRequest
  ): Promise<UpdateTicketApiResponse> => {
    try {
      if (!eventId || !ticketId) {
        throw new Error("Event ID and Ticket ID are required");
      }
      const response = await apiClient.patch<UpdateTicketApiResponse>(
        `/event/${eventId}/tickets/${ticketId}`,
        data
      );
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: unknown } };
        throw axiosError.response?.data || error;
      }
      throw error;
    }
  },

  /**
   * Delete tickets
   * DELETE /event/:eventId/tickets
   */
  deleteTickets: async (
    eventId: string,
    data: DeleteTicketsRequest
  ): Promise<DeleteTicketsApiResponse> => {
    try {
      if (!data.ticketIds || data.ticketIds.length === 0) {
        throw new Error("At least one ticket ID is required");
      }
      const response = await apiClient.delete<DeleteTicketsApiResponse>(
        `/event/${eventId}/tickets`,
        { data }
      );
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: unknown } };
        throw axiosError.response?.data || error;
      }
      throw error;
    }
  },

  /**
   * Get tickets for an event
   * GET /event/:eventId/tickets
   */
  getTickets: async (eventId: string): Promise<GetTicketsApiResponse> => {
    try {
      if (!eventId) {
        throw new Error("Event ID is required");
      }
      const response = await apiClient.get<GetTicketsApiResponse>(
        `/event/${eventId}/tickets`
      );
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: unknown } };
        throw axiosError.response?.data || error;
      }
      throw error;
    }
  },

  /**
   * Get tickets for a user (public view)
   * GET /event/:eventId/tickets/user
   */
  getTicketsForUser: async (
    eventId: string
  ): Promise<GetTicketsApiResponse> => {
    try {
      if (!eventId) {
        throw new Error("Event ID is required");
      }
      const response = await apiClient.get<GetTicketsApiResponse>(
        `/event/${eventId}/tickets/user`
      );
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: unknown } };
        throw axiosError.response?.data || error;
      }
      throw error;
    }
  },

  /**
   * Toggle ticket visibility
   * PATCH /event/:eventId/tickets/:ticketId/visibility
   */
  toggleTicketVisibility: async (
    eventId: string,
    ticketId: string,
    isVisible: boolean
  ): Promise<UpdateTicketApiResponse> => {
    try {
      if (!eventId || !ticketId) {
        throw new Error("Event ID and Ticket ID are required");
      }
      const response = await apiClient.patch<UpdateTicketApiResponse>(
        `/event/${eventId}/tickets/${ticketId}/visibility`,
        { isVisible }
      );
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: unknown } };
        throw axiosError.response?.data || error;
      }
      throw error;
    }
  },

  /**
   * Update an event
   * PATCH /event/:eventId
   */
  updateEvent: async (
    eventId: string,
    data: UpdateEventRequest
  ): Promise<UpdateEventApiResponse> => {
    try {
      if (!eventId) {
        throw new Error("Event ID is required");
      }
      const response = await apiClient.patch<UpdateEventApiResponse>(
        `/event/${eventId}`,
        data
      );
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: unknown } };
        throw axiosError.response?.data || error;
      }
      throw error;
    }
  },

  /**
   * Get event by ID
   * GET /event/:eventId
   */
  getEventById: async (eventId: string): Promise<GetEventByIdApiResponse> => {
    try {
      if (!eventId) {
        throw new Error("Event ID is required");
      }
      const response = await apiClient.get<GetEventByIdApiResponse>(
        `/event/${eventId}`
      );
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: unknown } };
        throw axiosError.response?.data || error;
      }
      throw error;
    }
  },

  /**
   * Get user events
   * GET /event/?status=draft|scheduled|published|completed
   */
  getUserEvents: async (status?: "draft" | "scheduled" | "published" | "completed"): Promise<GetUserEventsApiResponse> => {
    try {
      const params = status ? { status } : {};
      const response = await apiClient.get<GetUserEventsApiResponse>("/event/", {
        params,
      });
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: unknown } };
        throw axiosError.response?.data || error;
      }
      throw error;
    }
  },

  /**
   * Mark event as completed
   * POST /event/:eventId
   */
  markEventCompleted: async (
    eventId: string
  ): Promise<MarkEventCompletedApiResponse> => {
    try {
      if (!eventId) {
        throw new Error("Event ID is required");
      }
      const response = await apiClient.post<MarkEventCompletedApiResponse>(
        `/event/${eventId}`,
        {}
      );
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: unknown } };
        throw axiosError.response?.data || error;
      }
      throw error;
    }
  },

  /**
   * Delete an event
   * DELETE /event/:eventId
   */
  deleteEvent: async (eventId: string): Promise<DeleteEventApiResponse> => {
    try {
      if (!eventId) {
        throw new Error("Event ID is required");
      }
      const response = await apiClient.delete<DeleteEventApiResponse>(
        `/event/${eventId}`
      );
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: unknown } };
        throw axiosError.response?.data || error;
      }
      throw error;
    }
  },

  /**
   * Add vendor services to an event
   * PATCH /event/:eventId/vendor-services
   */
  addVendorServices: async (
    eventId: string,
    data: AddVendorServicesRequest
  ): Promise<AddVendorServicesApiResponse> => {
    try {
      if (!eventId) {
        throw new Error("Event ID is required");
      }
      if (!data.vendorServices || data.vendorServices.length === 0) {
        throw new Error("At least one vendor service is required");
      }
      const response = await apiClient.patch<AddVendorServicesApiResponse>(
        `/event/${eventId}/vendor-services`,
        data
      );
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: unknown } };
        throw axiosError.response?.data || error;
      }
      throw error;
    }
  },
};

