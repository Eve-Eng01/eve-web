/**
 * Create Event Integration
 * Helper functions for integrating event creation API with the UI flow
 */

import type { CreateDraftEventRequest, VirtualEvent } from "@/shared/api/services/events/types";
import type { PlatformData } from "../../../accessories/event-format-selector";
import {
  convertDateTimeEntriesToOccurrences,
  convertOneTimeToOccurrence,
  parseLocation,
  extractTimezone,
  formatRecurrence,
  formatEventFormat,
  validateEventData,
  DateTimeEntry,
} from "@utils/event-utils";


/**
 * Transform UI form data to API request format
 */
export interface CreateEventFormData {
  eventName: string;
  description: string;
  customUrl: string;
  category: string | null;
  format: string;
  platformData?: PlatformData | null;
  recurrence: string;
  timezone: string;
  location: string;
  locationLatitude?: number | null;
  locationLongitude?: number | null;
  selectedDate?: number;
  selectedMonth?: number;
  selectedYear?: number;
  startTime?: string;
  endTime?: string;
  endTimeNextDay?: boolean;
  dateTimeEntries?: DateTimeEntry[];
}

/**
 * Prepare event draft data for API submission
 */
export function prepareEventDraftData(
  formData: CreateEventFormData
): {
  data: CreateDraftEventRequest;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate required fields
  if (!formData.eventName || formData.eventName.trim().length < 3) {
    errors.push("Event name must be at least 3 characters");
  }

  if (!formData.description || formData.description.trim().length < 10) {
    errors.push("Description must be at least 10 characters");
  }

  if (!formData.category) {
    errors.push("Category is required");
  }

  if (!formData.format) {
    errors.push("Event format is required");
  }

  if (!formData.recurrence) {
    errors.push("Recurrence is required");
  }

  if (!formData.timezone) {
    errors.push("Timezone is required");
  }

  // Validate location for in-person/hybrid events
  const apiFormat = formatEventFormat(formData.format);
  if ((apiFormat === "in_person" || apiFormat === "hybrid") && !formData.location) {
    errors.push("Location is required for in-person or hybrid events");
  }

  // Validate platform data for virtual/hybrid events
  if ((apiFormat === "virtual" || apiFormat === "hybrid") && !formData.platformData) {
    errors.push("Platform/Access type is required for virtual or hybrid events");
  } else if (formData.platformData && !formData.platformData.meetingUrl) {
    errors.push("Meeting URL is required for virtual or hybrid events");
  } else if (formData.platformData && formData.platformData.meetingUrl) {
    // Validate URL format and security
    try {
      const urlObj = new URL(formData.platformData.meetingUrl);
      
      // Check if URL uses HTTPS
      if (urlObj.protocol !== "https:") {
        errors.push("Meeting URL must use HTTPS (secure connection)");
      }

      // Check if URL has a valid hostname
      if (!urlObj.hostname) {
        errors.push("Invalid URL format");
      }
    } catch {
      errors.push("Meeting URL must be a valid URL (e.g., https://meet.google.com/abc-defg-hij)");
    }
  }

  // Validate occurrences
  let occurrences: CreateDraftEventRequest["occurrences"] = [];

  if (formData.recurrence === "on-time") {
    if (
      !formData.selectedDate ||
      !formData.startTime ||
      !formData.endTime ||
      formData.selectedMonth === undefined ||
      formData.selectedYear === undefined
    ) {
      errors.push("Date and times are required for one-time events");
    } else {
      const occurrence = convertOneTimeToOccurrence(
        formData.selectedDate,
        formData.selectedMonth || 0,
        formData.selectedYear || new Date().getFullYear(),
        formData.startTime,
        formData.endTime,
        extractTimezone(formData.timezone),
        formData.endTimeNextDay || false
      );
      occurrences = [occurrence];
    }
  } else if (formData.recurrence === "recurring") {
    if (!formData.dateTimeEntries || formData.dateTimeEntries.length === 0) {
      errors.push("At least one date-time entry is required for recurring events");
    } else {
      const validEntries = formData.dateTimeEntries.filter(
        (entry) => entry.startTime && entry.endTime
      );
      if (validEntries.length === 0) {
        errors.push("At least one date with start and end times is required");
      } else {
        occurrences = convertDateTimeEntriesToOccurrences(
          validEntries,
          extractTimezone(formData.timezone)
        );
      }
    }
  }

  if (errors.length > 0) {
    return {
      data: {} as CreateDraftEventRequest,
      errors,
    };
  }

  // Build location object
  let location: CreateDraftEventRequest["location"] = undefined;
  if (formData.location && (apiFormat === "in_person" || apiFormat === "hybrid")) {
    location = parseLocation(
      formData.location,
      formData.locationLatitude,
      formData.locationLongitude
    );
  }

  // Build virtual event object
  let virtual: VirtualEvent | undefined = undefined;
  if (formData.platformData && (apiFormat === "virtual" || apiFormat === "hybrid")) {
    // Ensure platform is in correct format (with underscores)
    const platform = formData.platformData.platform;
    if (!["google_meet", "zoom", "youtube_live", "other"].includes(platform)) {
      errors.push(`Invalid platform: ${platform}. Must be one of: google_meet, zoom, youtube_live, other`);
    }
    
    virtual = {
      platform: platform as "google_meet" | "zoom" | "youtube_live" | "other",
      meetingUrl: formData.platformData.meetingUrl,
      ...(formData.platformData.meetingPassword && { password: formData.platformData.meetingPassword }),
      ...(formData.platformData.note && { note: formData.platformData.note }),
    };
  }

  // Build request data
  const requestData: CreateDraftEventRequest & { virtual?: VirtualEvent } = {
    name: formData.eventName.trim(),
    description: formData.description.trim(),
    ...(formData.customUrl?.trim() && { customUrl: formData.customUrl.trim() }),
    category: formData.category as string,
    format: apiFormat,
    recurrence: formatRecurrence(formData.recurrence),
    timezone: extractTimezone(formData.timezone),
    location: location || undefined,
    occurrences,
    ...(virtual && { virtual }),
  };

  // Final validation
  const validation = validateEventData(requestData);
  if (!validation.isValid) {
    return {
      data: requestData,
      errors: [...errors, ...validation.errors],
    };
  }

  return {
    data: requestData,
    errors: [],
  };
}

/**
 * Get user-friendly error messages
 */
export function formatValidationErrors(errors: string[]): string {
  if (errors.length === 0) return "";
  if (errors.length === 1) return errors[0];
  return `Please fix the following errors:\n${errors.map((e, i) => `${i + 1}. ${e}`).join("\n")}`;
}

