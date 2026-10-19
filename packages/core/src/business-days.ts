/**
 * Business day calculations for America/Sao_Paulo timezone.
 * Skips weekends and holidays from config/holidays.json.
 */

import {
  addDays,
  isWeekend,
  startOfDay,
  isSameDay,
} from "date-fns";
import { toZonedTime, fromZonedTime, format as formatTz } from "date-fns-tz";

export const TZ = "America/Sao_Paulo";

/**
 * Load holidays from config. In runtime this imports the JSON directly.
 * Tests can inject custom holiday lists via the holidays parameter.
 */
let _cachedHolidays: string[] | null = null;

export function loadHolidays(): string[] {
  if (_cachedHolidays) return _cachedHolidays;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const data = require("../../../config/holidays.json") as {
      holidays: string[];
    };
    _cachedHolidays = data.holidays;
    return _cachedHolidays;
  } catch {
    // Fallback if running in isolation
    return [];
  }
}

export function isHoliday(date: Date, holidays?: string[]): boolean {
  const h = holidays ?? loadHolidays();
  const zonedDate = toZonedTime(date, TZ);
  const dateStr = formatTz(zonedDate, "yyyy-MM-dd", { timeZone: TZ });
  return h.includes(dateStr);
}

export function isBusinessDay(date: Date, holidays?: string[]): boolean {
  const zonedDate = toZonedTime(date, TZ);
  if (isWeekend(zonedDate)) return false;
  if (isHoliday(date, holidays)) return false;
  return true;
}

/**
 * Add N business days to a date in São Paulo timezone.
 * Starts counting from the next day (not same day).
 */
export function addBusinessDays(
  date: Date,
  days: number,
  holidays?: string[]
): Date {
  let current = toZonedTime(date, TZ);
  let added = 0;
  while (added < days) {
    current = addDays(current, 1);
    if (isBusinessDay(fromZonedTime(current, TZ), holidays)) {
      added++;
    }
  }
  // Return at start of that business day in São Paulo, expressed as UTC
  const startOfBd = startOfDay(current);
  return fromZonedTime(startOfBd, TZ);
}

/**
 * Calculate preview due date: addBusinessDays(completedAt, 3)
 */
export function calcPreviewDue(intakeCompletedAt: Date, holidays?: string[]): Date {
  return addBusinessDays(intakeCompletedAt, 3, holidays);
}

/**
 * Calculate earliest go-live date: payment_date + 8 calendar days.
 * Per spec: calendar days, not business days.
 */
export function calcGoLiveEarliest(paymentDate: Date): Date {
  const zoned = toZonedTime(paymentDate, TZ);
  return fromZonedTime(addDays(startOfDay(zoned), 8), TZ);
}

/**
 * Count business days remaining until a target date from now.
 */
export function businessDaysUntil(
  target: Date,
  from: Date = new Date(),
  holidays?: string[]
): number {
  if (target <= from) return 0;
  let current = toZonedTime(from, TZ);
  const targetZoned = toZonedTime(target, TZ);
  let count = 0;
  while (current < targetZoned) {
    current = addDays(current, 1);
    if (isBusinessDay(fromZonedTime(current, TZ), holidays)) {
      if (!isSameDay(current, targetZoned) || targetZoned > current) {
        count++;
      }
    }
  }
  return count;
}
