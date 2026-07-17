// Commit planning -- A "plan" is just a sorted array of ISO date strings.
// Different strategies (random, pattern, text) all produce the same shape,
// so the executor never cares where a plan came from.

import { gridOrigin, cellDate, isFuture } from "./dates.js";

const randInt = (max, rng = Math.random) => Math.floor(rng() * (max + 1));

/**
 * Random scatter across the year.
 * `rng` is injectable so tests can pass a seeded generator and get deterministic output — this is why it's a parameter, not a global.
 */
export function buildRandomPlan(
  { total = 100, maxPerDay = 4, weeks = 52, now = new Date(), rng = Math.random } = {}
) {
  const origin = gridOrigin(now);
  const plan = [];
  let remaining = total;

  while (remaining > 0) {
    const x = randInt(weeks - 1, rng);
    const y = randInt(6, rng);
    const date = cellDate(origin, x, y);
    if (isFuture(date, now)) continue;
    const burst = Math.min(1 + randInt(maxPerDay - 1, rng), remaining);
    for (let i = 0; i < burst; i++) plan.push(date.toISOString());
    remaining -= burst;
  }
  return plan.sort();
}

/** Aggregate a plan into per-day counts — the preview renderer will feed on this. */
export function planToDayCounts(plan) {
  const counts = new Map();
  for (const iso of plan) {
    const day = iso.slice(0, 10);
    counts.set(day, (counts.get(day) ?? 0) + 1);
  }
  return counts;
}