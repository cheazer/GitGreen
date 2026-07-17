/** finds out the start square */
export function gridOrigin(now = new Date()) {
  const d = new Date(now);/** take the current date if no-one passes a date */
  d.setFullYear(d.getFullYear() - 1);
  d.setDate(d.getDate() + 1);
  while (d.getDay() !== 0) d.setDate(d.getDate() + 1);
  d.setHours(12, 0, 0, 0); // midday dodges DST/timezone day-boundary bugs
  return d;
}

/** (x weeks, y days) from origin -> Date at midday. */
export function cellDate(origin, x, y) {
  const d = new Date(origin);
  d.setDate(d.getDate() + x * 7 + y);
  return d;
}

/** Inverse: which (x, y) cell does a date fall in? Handy for the preview renderer. */
export function dateToCell(origin, date) {
  const days = Math.floor((date - origin) / 86_400_000);
  return { x: Math.floor(days / 7), y: days % 7 };
}

export const isFuture = (date, now = new Date()) => date > now;