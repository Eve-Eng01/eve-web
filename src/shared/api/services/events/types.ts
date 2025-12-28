/**
 * Events Service Types
 * Type definitions for event-related API requests and responses
 */

import { ApiResponse } from "../../config";

/**
 * Event Format Types
 */
export type EventFormat = "in_person" | "virtual" | "hybrid";

/**
 * Event Recurrence Types
 */
export type EventRecurrence = "one_time" | "recurring";

/**
 * Event Visibility Types
 */
export type EventVisibility = "public" | "private";

/**
 * Event Status Types
 */
export type EventStatus = "draft" | "scheduled" | "completed" | "cancelled";

/**
 * Ticket Kind Types
 */
export type TicketKind = "paid" | "free" | "donation";

/**
 * Ticket Quantity Mode Types
 */
export type TicketQuantityMode = "limited" | "unlimited";

/**
 * Refund Policy Types
 */
export type RefundPolicyType = "automated" | "time_bound" | null;

/**
 * Time Slot
 */
export interface TimeSlot {
  _id?: string;
  startAt: string; // ISO 8601 format
  endAt: string; // ISO 8601 format
}

/**
 * Event Occurrence
 */
export interface EventOccurrence {
  _id?: string;
  date: string; // YYYY-MM-DD format
  timeSlots: TimeSlot[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Location
 */
export interface Location {
  address: string;
  venue: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Virtual Event Details
 */
export interface VirtualEvent {
  platform: string;
  meetingUrl: string;
  password?: string;
  note?: string;
}

/**
 * Media Asset
 */
export interface MediaAsset {
  assetId: string;
  provider: string;
  url: string;
}

/**
 * Refund Policy
 */
export interface RefundPolicy {
  type: RefundPolicyType;
  cutoffDays?: number;
}

/**
 * Ticket
 */
export interface Ticket {
  _id?: string;
  eventId?: string;
  kind: TicketKind;
  name: string;
  price: number;
  currency: string;
  quantityMode: TicketQuantityMode;
  quantity?: number;
  sold?: number;
  purchaseLimitPerUser?: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

/**
 * Vendor Service
 */
export interface VendorService {
  _id?: string;
  name: string;
  proposalLimit: number;
}

/**
 * Event
 */
export interface Event {
  _id: string;
  organizerId: string;
  organizerName: string;
  name: string;
  description: string;
  slug: string;
  customUrl: string;
  category: string;
  format: EventFormat;
  recurrence: EventRecurrence;
  occurrences: EventOccurrence[];
  timezone: string;
  location?: Location | null;
  tickets?: Ticket[];
  visibility?: EventVisibility | null;
  privateToken?: string | null;
  privateLink?: string | null;
  refundPolicy?: RefundPolicy;
  status: EventStatus;
  media?: MediaAsset | null;
  virtual?: VirtualEvent | null;
  vendorServices?: VendorService[];
  PublishDate?: string | null; // ISO 8601 format
  publishedAt?: string | null; // ISO 8601 format
  reviews?: unknown[];
  averageRating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

/**
 * Create Draft Event Request
 */
export interface CreateDraftEventRequest {
  name: string;
  description?: string;
  customUrl?: string;
  category: string;
  format: EventFormat;
  recurrence: EventRecurrence;
  timezone: string;
  location?: Location;
  occurrences: EventOccurrence[];
  virtual?: VirtualEvent;
}

/**
 * Create Draft Event Response
 * This matches the actual API response structure
 */
export interface CreateDraftEventResponse {
  status: boolean;
  message: string;
  data?: {
    eventId?: string;
    event?: Event;
  };
}

/**
 * Upload Media Request (FormData)
 */
export interface UploadMediaRequest {
  media: File;
}

/**
 * Upload Media Response
 */
export interface UploadMediaResponse {
  status: boolean;
  message: string;
  data: {
    assetId: string;
    provider: string;
    url: string;
  };
}

/**
 * Create Ticket Request
 */
export interface CreateTicketRequest {
  kind: TicketKind;
  name: string;
  price: number;
  currency: string;
  quantityMode: TicketQuantityMode;
  quantity?: number;
  purchaseLimitPerUser?: number;
  description?: string;
}

/**
 * Create Ticket Response
 */
export interface CreateTicketResponse {
  status: boolean;
  message: string;
}

/**
 * Update Ticket Request
 */
export interface UpdateTicketRequest {
  kind?: TicketKind;
  name?: string;
  price?: number;
  currency?: string;
  quantityMode?: TicketQuantityMode;
  quantity?: number;
  purchaseLimitPerUser?: number;
  description?: string;
}

/**
 * Update Ticket Response
 */
export interface UpdateTicketResponse {
  status: boolean;
  message: string;
}

/**
 * Delete Tickets Request
 */
export interface DeleteTicketsRequest {
  ticketIds: string[];
}

/**
 * Delete Tickets Response
 */
export interface DeleteTicketsResponse {
  status: boolean;
  message: string;
}

/**
 * Get Tickets Response
 */
export interface GetTicketsResponse {
  status: boolean;
  message: string;
  data: Ticket[];
}

/**
 * Update Event Request
 */
export interface UpdateEventRequest {
  name?: string;
  description?: string;
  customUrl?: string;
  category?: string;
  format?: EventFormat;
  recurrence?: EventRecurrence;
  timezone?: string;
  location?: Location;
  occurrences?: EventOccurrence[];
  visibility?: EventVisibility;
  refundPolicy?: RefundPolicy;
  PublishDate?: string; // ISO 8601 format
  virtual?: VirtualEvent;
  vendorServices?: VendorService[];
}

/**
 * Update Event Response
 */
export interface UpdateEventResponse {
  status: boolean;
  message: string;
  data?: {
    event: Event;
  };
}

/**
 * Get Event By ID Response
 */
export interface GetEventByIdResponse {
  status: boolean;
  message: string;
  event?: Event;
  data?: {
    event: Event;
  };
}

/**
 * Get User Events Response
 */
export interface GetUserEventsResponse {
  status: boolean;
  message: string;
  data: {
    events: Event[];
  };
}

/**
 * Mark Event Completed Response
 */
export interface MarkEventCompletedResponse {
  status: boolean;
  message: string;
}

/**
 * Delete Event Response
 */
export interface DeleteEventResponse {
  status: boolean;
  message: string;
}

/**
 * Add Vendor Services Request
 */
export interface AddVendorServicesRequest {
  vendorServices: VendorService[];
}

/**
 * Add Vendor Services Response
 */
export interface AddVendorServicesResponse {
  status: boolean;
  message: string;
  data: {
    event: Event;
  };
}

/**
 * API Response Types
 * Note: The API returns responses directly, not wrapped in ApiResponse
 */
export type CreateDraftEventApiResponse = CreateDraftEventResponse;
export type UploadMediaApiResponse = ApiResponse<UploadMediaResponse>;
export type CreateTicketApiResponse = ApiResponse<CreateTicketResponse>;
export type UpdateTicketApiResponse = ApiResponse<UpdateTicketResponse>;
export type DeleteTicketsApiResponse = ApiResponse<DeleteTicketsResponse>;
export type GetTicketsApiResponse = ApiResponse<GetTicketsResponse>;
export type UpdateEventApiResponse = ApiResponse<UpdateEventResponse>;
export type GetEventByIdApiResponse = ApiResponse<GetEventByIdResponse>;
export type GetUserEventsApiResponse = GetUserEventsResponse;
export type MarkEventCompletedApiResponse = ApiResponse<MarkEventCompletedResponse>;
export type DeleteEventApiResponse = ApiResponse<DeleteEventResponse>;
export type AddVendorServicesApiResponse = ApiResponse<AddVendorServicesResponse>;

