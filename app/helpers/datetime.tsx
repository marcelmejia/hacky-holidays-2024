import { DateTime } from "luxon";

export function FormatDateShort(dateTime: string): string {
  return DateTime.fromISO(dateTime).toLocaleString(DateTime.DATE_SHORT);
}