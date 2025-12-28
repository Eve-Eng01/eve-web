/**
 * Events Form Validation Schemas
 * Yup schemas for event-related forms
 */

import * as yup from "yup";

/**
 * Time Slot Schema
 */
export const timeSlotSchema = yup.object().shape({
  startAt: yup
    .string()
    .required("Start time is required")
    .matches(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})$/,
      "Start time must be in ISO 8601 format"
    ),
  endAt: yup
    .string()
    .required("End time is required")
    .matches(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})$/,
      "End time must be in ISO 8601 format"
    )
    .test(
      "is-after-start",
      "End time must be after start time",
      function (endAt) {
        const { startAt } = this.parent;
        if (!startAt || !endAt) return true;
        return new Date(endAt) > new Date(startAt);
      }
    ),
});

/**
 * Event Occurrence Schema
 */
export const eventOccurrenceSchema = yup.object().shape({
  date: yup
    .string()
    .required("Date is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  timeSlots: yup
    .array()
    .of(timeSlotSchema)
    .min(1, "At least one time slot is required")
    .required("Time slots are required"),
});

/**
 * Location Schema
 */
export const locationSchema = yup.object().shape({
  address: yup
    .string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must be less than 200 characters")
    .trim(),
  venue: yup
    .string()
    .required("Venue is required")
    .min(2, "Venue must be at least 2 characters")
    .max(100, "Venue must be less than 100 characters")
    .trim(),
});

/**
 * Virtual Event Schema
 */
export const virtualEventSchema = yup.object().shape({
  platform: yup
    .string()
    .required("Platform is required")
    .min(2, "Platform must be at least 2 characters")
    .max(50, "Platform must be less than 50 characters"),
  meetingUrl: yup
    .string()
    .required("Meeting URL is required")
    .url("Meeting URL must be a valid URL"),
  password: yup.string().max(100, "Password must be less than 100 characters"),
  note: yup.string().max(500, "Note must be less than 500 characters"),
});

/**
 * Refund Policy Schema
 */
export const refundPolicySchema = yup.object().shape({
  type: yup
    .string()
    .oneOf(["automated", "time_bound", null], "Invalid refund policy type")
    .nullable(),
  cutoffDays: yup
    .number()
    .when("type", {
      is: "time_bound",
      then: (schema) =>
        schema
          .required("Cutoff days is required for time-bound refund policy")
          .min(1, "Cutoff days must be at least 1")
          .max(365, "Cutoff days must be less than 365"),
      otherwise: (schema) => schema.nullable(),
    }),
});

/**
 * Create Draft Event Schema
 */
export const createDraftEventSchema = yup.object().shape({
  name: yup
    .string()
    .required("Event name is required")
    .min(3, "Event name must be at least 3 characters")
    .max(200, "Event name must be less than 200 characters")
    .trim(),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description must be less than 5000 characters")
    .trim(),
  customUrl: yup
    .string()
    .required("Custom URL is required")
    .url("Custom URL must be a valid URL")
    .max(500, "Custom URL must be less than 500 characters"),
  category: yup
    .string()
    .required("Category is required")
    .min(2, "Category must be at least 2 characters")
    .max(100, "Category must be less than 100 characters")
    .trim(),
  format: yup
    .string()
    .oneOf(["in_person", "virtual", "hybrid"], "Invalid event format")
    .required("Format is required"),
  recurrence: yup
    .string()
    .oneOf(["one_time", "recurring"], "Invalid recurrence type")
    .required("Recurrence is required"),
  timezone: yup
    .string()
    .required("Timezone is required")
    .min(1, "Timezone must be at least 1 character")
    .max(100, "Timezone must be less than 100 characters"),
  location: locationSchema.nullable().when("format", {
    is: (format: string) => format === "in_person" || format === "hybrid",
    then: (schema) => schema.required("Location is required for in-person or hybrid events"),
    otherwise: (schema) => schema.nullable(),
  }),
  occurrences: yup
    .array()
    .of(eventOccurrenceSchema)
    .min(1, "At least one occurrence is required")
    .required("Occurrences are required"),
});

/**
 * Create Ticket Schema
 */
export const createTicketSchema = yup.object().shape({
  kind: yup
    .string()
    .oneOf(["paid", "free", "donation"], "Invalid ticket kind")
    .required("Ticket kind is required"),
  name: yup
    .string()
    .required("Ticket name is required")
    .min(2, "Ticket name must be at least 2 characters")
    .max(100, "Ticket name must be less than 100 characters")
    .trim(),
  price: yup
    .number()
    .when("kind", {
      is: (kind: string) => kind === "paid" || kind === "donation",
      then: (schema) =>
        schema
          .required("Price is required for paid or donation tickets")
          .min(0, "Price must be 0 or greater")
          .max(1000000, "Price must be less than 1,000,000"),
      otherwise: (schema) => schema.nullable(),
    }),
  currency: yup
    .string()
    .when("kind", {
      is: (kind: string) => kind === "paid" || kind === "donation",
      then: (schema) =>
        schema
          .required("Currency is required for paid or donation tickets")
          .length(3, "Currency must be a 3-letter ISO code")
          .matches(/^[A-Z]{3}$/, "Currency must be a valid ISO 4217 code"),
      otherwise: (schema) => schema.nullable(),
    }),
  quantityMode: yup
    .string()
    .oneOf(["limited", "unlimited"], "Invalid quantity mode")
    .required("Quantity mode is required"),
  quantity: yup
    .number()
    .when("quantityMode", {
      is: "limited",
      then: (schema) =>
        schema
          .required("Quantity is required for limited tickets")
          .min(1, "Quantity must be at least 1")
          .max(1000000, "Quantity must be less than 1,000,000")
          .integer("Quantity must be a whole number"),
      otherwise: (schema) => schema.nullable(),
    }),
  purchaseLimitPerUser: yup
    .number()
    .min(1, "Purchase limit per user must be at least 1")
    .max(1000, "Purchase limit per user must be less than 1000")
    .integer("Purchase limit must be a whole number")
    .nullable(),
  description: yup
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .nullable(),
});

/**
 * Update Ticket Schema (all fields optional)
 */
export const updateTicketSchema = yup.object().shape({
  kind: yup
    .string()
    .oneOf(["paid", "free", "donation"], "Invalid ticket kind")
    .nullable(),
  name: yup
    .string()
    .min(2, "Ticket name must be at least 2 characters")
    .max(100, "Ticket name must be less than 100 characters")
    .trim()
    .nullable(),
  price: yup
    .number()
    .min(0, "Price must be 0 or greater")
    .max(1000000, "Price must be less than 1,000,000")
    .nullable(),
  currency: yup
    .string()
    .length(3, "Currency must be a 3-letter ISO code")
    .matches(/^[A-Z]{3}$/, "Currency must be a valid ISO 4217 code")
    .nullable(),
  quantityMode: yup
    .string()
    .oneOf(["limited", "unlimited"], "Invalid quantity mode")
    .nullable(),
  quantity: yup
    .number()
    .min(1, "Quantity must be at least 1")
    .max(1000000, "Quantity must be less than 1,000,000")
    .integer("Quantity must be a whole number")
    .nullable(),
  purchaseLimitPerUser: yup
    .number()
    .min(1, "Purchase limit per user must be at least 1")
    .max(1000, "Purchase limit per user must be less than 1000")
    .integer("Purchase limit must be a whole number")
    .nullable(),
  description: yup
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .nullable(),
});

/**
 * Delete Tickets Schema
 */
export const deleteTicketsSchema = yup.object().shape({
  ticketIds: yup
    .array()
    .of(yup.string().required("Ticket ID is required"))
    .min(1, "At least one ticket ID is required")
    .required("Ticket IDs are required"),
});

/**
 * Update Event Schema (all fields optional)
 */
export const updateEventSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, "Event name must be at least 3 characters")
    .max(200, "Event name must be less than 200 characters")
    .trim()
    .nullable(),
  description: yup
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description must be less than 5000 characters")
    .trim()
    .nullable(),
  customUrl: yup
    .string()
    .url("Custom URL must be a valid URL")
    .max(500, "Custom URL must be less than 500 characters")
    .nullable(),
  category: yup
    .string()
    .min(2, "Category must be at least 2 characters")
    .max(100, "Category must be less than 100 characters")
    .trim()
    .nullable(),
  format: yup
    .string()
    .oneOf(["in_person", "virtual", "hybrid"], "Invalid event format")
    .nullable(),
  recurrence: yup
    .string()
    .oneOf(["one_time", "recurring"], "Invalid recurrence type")
    .nullable(),
  timezone: yup
    .string()
    .min(1, "Timezone must be at least 1 character")
    .max(100, "Timezone must be less than 100 characters")
    .nullable(),
  location: locationSchema.nullable(),
  occurrences: yup.array().of(eventOccurrenceSchema).nullable(),
  visibility: yup
    .string()
    .oneOf(["public", "private"], "Invalid visibility type")
    .nullable(),
  refundPolicy: refundPolicySchema.nullable(),
  PublishDate: yup
    .string()
    .matches(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})$/,
      "Publish date must be in ISO 8601 format"
    )
    .nullable(),
  virtual: virtualEventSchema.nullable(),
  vendorServices: yup
    .array()
    .of(
      yup.object().shape({
        name: yup
          .string()
          .required("Service name is required")
          .min(2, "Service name must be at least 2 characters")
          .max(100, "Service name must be less than 100 characters"),
        proposalLimit: yup
          .number()
          .required("Proposal limit is required")
          .min(1, "Proposal limit must be at least 1")
          .max(1000, "Proposal limit must be less than 1000")
          .integer("Proposal limit must be a whole number"),
      })
    )
    .nullable(),
});

/**
 * Add Vendor Services Schema
 */
export const addVendorServicesSchema = yup.object().shape({
  vendorServices: yup
    .array()
    .of(
      yup.object().shape({
        name: yup
          .string()
          .required("Service name is required")
          .min(2, "Service name must be at least 2 characters")
          .max(100, "Service name must be less than 100 characters"),
        proposalLimit: yup
          .number()
          .required("Proposal limit is required")
          .min(1, "Proposal limit must be at least 1")
          .max(1000, "Proposal limit must be less than 1000")
          .integer("Proposal limit must be a whole number"),
      })
    )
    .min(1, "At least one vendor service is required")
    .required("Vendor services are required"),
});

/**
 * Type exports
 */
export type CreateDraftEventFormData = yup.InferType<typeof createDraftEventSchema>;
export type CreateTicketFormData = yup.InferType<typeof createTicketSchema>;
export type UpdateTicketFormData = yup.InferType<typeof updateTicketSchema>;
export type DeleteTicketsFormData = yup.InferType<typeof deleteTicketsSchema>;
export type UpdateEventFormData = yup.InferType<typeof updateEventSchema>;
export type AddVendorServicesFormData = yup.InferType<typeof addVendorServicesSchema>;

