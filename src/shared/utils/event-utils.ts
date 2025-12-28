/**
 * Event Utilities
 * Helper functions for event data transformation and validation
 */

import type {
  EventOccurrence,
  TimeSlot,
  Location,
  CreateDraftEventRequest,
} from "../api/services/events/types";

/**
 * Convert date components to ISO date string (YYYY-MM-DD)
 */
export function formatDateToISO(
  date: number,
  month: number,
  year: number
): string {
  const monthStr = String(month + 1).padStart(2, "0");
  const dateStr = String(date).padStart(2, "0");
  return `${year}-${monthStr}-${dateStr}`;
}

/**
 * Convert time string (e.g., "2:45 PM") to 24-hour format
 */
export function convertTo24Hour(time: string): string {
  const [timePart, period] = time.split(" ");
  const [hours, minutes] = timePart.split(":").map(Number);
  
  let hour24 = hours;
  if (period === "PM" && hours !== 12) {
    hour24 = hours + 12;
  } else if (period === "AM" && hours === 12) {
    hour24 = 0;
  }
  
  return `${String(hour24).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/**
 * Convert date and time to ISO 8601 format
 */
export function formatDateTimeToISO(
  date: string, // YYYY-MM-DD
  time: string, // HH:MM format (24-hour)
  timezone: string = "UTC"
): string {
  // For UTC, we can use Z suffix
  if (timezone.includes("UTC")) {
    return `${date}T${time}:00Z`;
  }
  
  // For other timezones, we'd need to calculate offset
  // For now, defaulting to UTC
  return `${date}T${time}:00Z`;
}

/**
 * Parse location string into Location object
 * Attempts to extract venue and address from a location string
 * Optionally includes latitude and longitude if provided
 */
export function parseLocation(
  locationString: string,
  latitude?: number | null,
  longitude?: number | null
): Location | null {
  if (!locationString || locationString.trim().length === 0) {
    return null;
  }

  // Try to split by common separators
  const parts = locationString.split(/[,;]/).map((p) => p.trim()).filter(Boolean);
  
  let location: Location;
  
  if (parts.length >= 2) {
    // Assume first part is venue, rest is address
    location = {
      venue: parts[0],
      address: parts.slice(1).join(", "),
    };
  } else {
    // If only one part, use it as address and try to extract venue
    const locationText = parts[0] || locationString;
    const venueMatch = locationText.match(/(.+?)\s+(?:at|@|in)\s+(.+)/i);
    
    if (venueMatch) {
      location = {
        venue: venueMatch[1].trim(),
        address: venueMatch[2].trim(),
      };
    } else {
      // Default: use location as address, extract a simple venue name
      const words = locationText.split(" ");
      const venue = words.length > 1 ? words.slice(0, 2).join(" ") : locationText;
      
      location = {
        venue,
        address: locationText,
      };
    }
  }
  
  // Add coordinates if provided
  if (latitude != null && longitude != null) {
    location.latitude = latitude;
    location.longitude = longitude;
  }
  
  return location;
}

/**
 * Transform UI date/time format to API format
 */
export interface DateTimeEntry {
  id: number;
  date: number;
  month: number;
  year: number;
  startTime: string; // "2:45 PM" format
  endTime: string; // "10:45 AM" format
  endTimeNextDay?: boolean; // If true, end time is on the next day
}

/**
 * Add days to date components (handles month/year boundaries efficiently)
 * More performant than string parsing - works directly with date components
 * 
 * @param date - Day of month (1-31)
 * @param month - Month index (0-11)
 * @param year - Full year (e.g., 2025)
 * @param daysToAdd - Number of days to add (typically 1 for next day)
 * @returns ISO date string (YYYY-MM-DD)
 */
function addDaysToDateComponents(
  date: number,
  month: number,
  year: number,
  daysToAdd: number
): string {
  // Use Date object for automatic handling of month/year boundaries
  // This is more reliable than manual calculation (handles leap years, month lengths)
  const jsDate = new Date(year, month, date);
  jsDate.setDate(jsDate.getDate() + daysToAdd);
  
  const newYear = jsDate.getFullYear();
  const newMonth = jsDate.getMonth();
  const newDate = jsDate.getDate();
  
  // Format as ISO string (YYYY-MM-DD)
  const monthStr = String(newMonth + 1).padStart(2, "0");
  const dateStr = String(newDate).padStart(2, "0");
  return `${newYear}-${monthStr}-${dateStr}`;
}

/**
 * Convert DateTimeEntry to EventOccurrence
 * Optimized to avoid unnecessary date string conversions when endTimeNextDay is false
 */
export function convertDateTimeEntryToOccurrence(
  entry: DateTimeEntry,
  timezone: string
): EventOccurrence {
  const dateStr = formatDateToISO(entry.date, entry.month, entry.year);
  const startTime24 = convertTo24Hour(entry.startTime);
  const endTime24 = convertTo24Hour(entry.endTime);
  
  // Calculate end date only if needed (avoid unnecessary computation)
  const endDateStr = entry.endTimeNextDay
    ? addDaysToDateComponents(entry.date, entry.month, entry.year, 1)
    : dateStr;
  
  const startAt = formatDateTimeToISO(dateStr, startTime24, timezone);
  const endAt = formatDateTimeToISO(endDateStr, endTime24, timezone);
  
  return {
    date: dateStr,
    timeSlots: [
      {
        startAt,
        endAt,
      },
    ],
  };
}

/**
 * Convert single date/time to EventOccurrence (for one-time events)
 * Optimized to work directly with date components when endTimeNextDay is true
 */
export function convertOneTimeToOccurrence(
  date: number,
  month: number,
  year: number,
  startTime: string,
  endTime: string,
  timezone: string,
  endTimeNextDay?: boolean
): EventOccurrence {
  const dateStr = formatDateToISO(date, month, year);
  const startTime24 = convertTo24Hour(startTime);
  const endTime24 = convertTo24Hour(endTime);
  
  // Calculate end date only if needed - use date components directly for better performance
  const endDateStr = endTimeNextDay
    ? addDaysToDateComponents(date, month, year, 1)
    : dateStr;
  
  const startAt = formatDateTimeToISO(dateStr, startTime24, timezone);
  const endAt = formatDateTimeToISO(endDateStr, endTime24, timezone);
  
  return {
    date: dateStr,
    timeSlots: [
      {
        startAt,
        endAt,
      },
    ],
  };
}

/**
 * Group DateTimeEntries by date and convert to occurrences
 */
export function convertDateTimeEntriesToOccurrences(
  entries: DateTimeEntry[],
  timezone: string
): EventOccurrence[] {
  // Group entries by date
  const dateMap = new Map<string, DateTimeEntry[]>();
  
  entries.forEach((entry) => {
    const dateStr = formatDateToISO(entry.date, entry.month, entry.year);
    const existing = dateMap.get(dateStr) || [];
    existing.push(entry);
    dateMap.set(dateStr, existing);
  });
  
  // Convert each date group to an occurrence
  const occurrences: EventOccurrence[] = [];
  
  dateMap.forEach((dateEntries, dateStr) => {
    // Pre-filter to avoid unnecessary processing
    const validEntries = dateEntries.filter((entry) => entry.startTime && entry.endTime);
    
    if (validEntries.length === 0) return;
    
    // Parse dateStr once for reuse (if needed)
    const dateParts = dateStr.split("-").map(Number);
    const baseYear = dateParts[0];
    const baseMonth = dateParts[1] - 1; // Convert to 0-indexed
    const baseDate = dateParts[2];
    
    const timeSlots: TimeSlot[] = validEntries.map((entry) => {
      const startTime24 = convertTo24Hour(entry.startTime);
      const endTime24 = convertTo24Hour(entry.endTime);
      
      // Optimized: use date components directly instead of string manipulation
      const endDateStr = entry.endTimeNextDay
        ? addDaysToDateComponents(baseDate, baseMonth, baseYear, 1)
        : dateStr;
      
      return {
        startAt: formatDateTimeToISO(dateStr, startTime24, timezone),
        endAt: formatDateTimeToISO(endDateStr, endTime24, timezone),
      };
    });
    
    if (timeSlots.length > 0) {
      occurrences.push({
        date: dateStr,
        timeSlots,
      });
    }
  });
  
  // Sort occurrences by date
  occurrences.sort((a, b) => a.date.localeCompare(b.date));
  
  return occurrences;
}

/**
 * Extract timezone from timezone string
 * Converts "West Africa Time (WAT) UTC +01:00" to "UTC" or appropriate format
 */
export function extractTimezone(timezoneString: string): string {
  if (!timezoneString) return "UTC";
  
  // Check for UTC
  if (timezoneString.includes("UTC")) {
    // Try to extract offset
    const offsetMatch = timezoneString.match(/UTC\s*([+-]\d{2}:\d{2})/);
    if (offsetMatch) {
      return `UTC${offsetMatch[1]}`;
    }
    return "UTC";
  }
  
  // Try to extract IANA timezone name
  const ianaMatch = timezoneString.match(/([A-Z][a-z]+\/[A-Z][a-z_]+)/);
  if (ianaMatch) {
    return ianaMatch[1];
  }
  
  // Default to UTC
  return "UTC";
}

/**
 * Validate event data before submission
 */
export function validateEventData(data: Partial<CreateDraftEventRequest>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!data.name || data.name.trim().length < 3) {
    errors.push("Event name must be at least 3 characters");
  }
  
  if (!data.description || data.description.trim().length < 10) {
    errors.push("Description must be at least 10 characters");
  }
  
  if (data.customUrl && !isValidUrl(data.customUrl)) {
    errors.push("Custom URL must be a valid URL");
  }
  
  if (!data.category || data.category.trim().length < 2) {
    errors.push("Category is required");
  }
  
  if (!data.format || !["in_person", "virtual", "hybrid"].includes(data.format)) {
    errors.push("Valid event format is required");
  }
  
  if (!data.recurrence || !["one_time", "recurring"].includes(data.recurrence)) {
    errors.push("Valid recurrence type is required");
  }
  
  if (!data.timezone || data.timezone.trim().length === 0) {
    errors.push("Timezone is required");
  }
  
  if ((data.format === "in_person" || data.format === "hybrid") && !data.location) {
    errors.push("Location is required for in-person or hybrid events");
  }
  
  if (!data.occurrences || data.occurrences.length === 0) {
    errors.push("At least one occurrence is required");
  } else {
    data.occurrences.forEach((occurrence, index) => {
      if (!occurrence.date || !/^\d{4}-\d{2}-\d{2}$/.test(occurrence.date)) {
        errors.push(`Occurrence ${index + 1}: Invalid date format`);
      }
      
      if (!occurrence.timeSlots || occurrence.timeSlots.length === 0) {
        errors.push(`Occurrence ${index + 1}: At least one time slot is required`);
      } else {
        occurrence.timeSlots.forEach((slot, slotIndex) => {
          if (!slot.startAt || !slot.endAt) {
            errors.push(
              `Occurrence ${index + 1}, Time slot ${slotIndex + 1}: Start and end times are required`
            );
          } else if (new Date(slot.endAt) <= new Date(slot.startAt)) {
            errors.push(
              `Occurrence ${index + 1}, Time slot ${slotIndex + 1}: End time must be after start time`
            );
          }
        });
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Simple URL validation
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Format recurrence from UI format to API format
 */
export function formatRecurrence(uiRecurrence: string): "one_time" | "recurring" {
  return uiRecurrence === "on-time" ? "one_time" : "recurring";
}

/**
 * Format event format from UI format to API format
 */
export function formatEventFormat(uiFormat: string): "in_person" | "virtual" | "hybrid" {
  if (uiFormat === "in-person" || uiFormat === "in_person") {
    return "in_person";
  }
  if (uiFormat === "virtual") {
    return "virtual";
  }
  if (uiFormat === "hybrid") {
    return "hybrid";
  }
  // Default fallback
  return "in_person";
}

