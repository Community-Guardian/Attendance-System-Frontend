import dayjs from "dayjs"
import localizedFormat from "dayjs/plugin/localizedFormat"

dayjs.extend(localizedFormat)

/**
 * Formats a date-time string into a human-readable format.
 * @param dateString - The date-time string to format.
 * @returns Formatted date-time (e.g., "Feb 16, 2025 10:30 AM").
 */
export function formatDateTime(dateString: string): string {
  return dayjs(dateString).format("MMM D, YYYY h:mm A") // Example: "Feb 16, 2025 10:30 AM"
}
