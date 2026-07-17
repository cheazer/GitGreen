// Renders a plan as the contribution graph it will produce 

import { gridOrigin, dateToCell } from "./dates.js";
import { planToDayCounts } from "./plan.js";

// ANSI 256-color background codes approximating GitHub's green scale.
const SHADES = [
  "\x1b[48;5;238m", // 0 
  "\x1b[48;5;22m",  // 1 
  "\x1b[48;5;28m",  // 2
  "\x1b[48;5;34m",  // 3
  "\x1b[48;5;40m",  // 4+ — brightest
];
const RESET = "\x1b[0m";
const DAY_LABELS = ["   ", "Mon", "   ", "Wed", "   ", "Fri", "   "];

export function renderPlan(plan, { weeks = 52, now = new Date() } = {}) {
  const origin = gridOrigin(now);
  const counts = planToDayCounts(plan);

  // Build a 7row × weeks-column grid of commit counts.
  const grid = Array.from({ length: 7 }, () => new Array(weeks).fill(0));
  for (const [day, count] of counts) {
    const { x, y } = dateToCell(origin, new Date(day + "T12:00:00"));
    if (x >= 0 && x < weeks && y >= 0 && y < 7) grid[y][x] = count;
  }

  let out = "";
  for (let y = 0; y < 7; y++) {
    out += DAY_LABELS[y] + " ";
    for (let x = 0; x < weeks; x++) {
      const shade = SHADES[Math.min(grid[y][x], SHADES.length - 1)];
      out += `${shade}  ${RESET}`;
    }
    out += "\n";
  }

  const days = counts.size;
  out += `\n${plan.length} commits · ${days} active days · max ${Math.max(0, ...counts.values())}/day\n`;
  return out;
}