import { getISOWeek } from "date-fns";

/**
 * Returns ISO week number for a given date
 */
export function getWeekNumber(date = new Date()) {
  return getISOWeek(date);
}

/**
 * Returns human-readable UTC offset string (e.g. "UTC+10:00")
 */
export function getUtcOffset(date = new Date()) {
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMinutes);
  const hours = String(Math.floor(abs / 60)).padStart(2, "0");
  const minutes = String(abs % 60).padStart(2, "0");
  return `UTC${sign}${hours}:${minutes}`;
}

/**
 * Formats a date in a given IANA timezone
 */
export function formatInTimeZone(date, timeZone, formatStr = "HH:mm:ss") {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date);
  } catch {
    return "--:--:--";
  }
}

/**
 * Returns full date string for a timezone
 */
export function getDateInTimeZone(date, timeZone) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch {
    return "—";
  }
}
