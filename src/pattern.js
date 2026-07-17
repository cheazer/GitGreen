// Stencil -> plan. A stencil is ASCII art, max 7 rows:
//   "."  = no commits
//   "1".."9" = that many commits on that day
//   "X" or "x" = 4 commits 
// Row 0 = Sunday. Each column = one week.

import { gridOrigin, cellDate, isFuture } from "./dates.js";

/** Parse stencil text into a 2D array of counts. Pure; throws on bad input. */
export function parseStencil(text) {
  const rows = text
    .split("\n")
    .map((r) => r.trimEnd())
    .filter((r) => r.length > 0);

  if (rows.length === 0) throw new Error("stencil is empty");
  if (rows.length > 7) throw new Error(`stencil has ${rows.length} rows — the graph is only 7 tall`);

  return rows.map((row, y) =>
    [...row].map((ch, x) => {
      if (ch === "." || ch === " ") return 0;
      if (ch === "X" || ch === "x") return 4;
      if (ch >= "1" && ch <= "9") return Number(ch);
      throw new Error(`bad character "${ch}" at row ${y + 1}, col ${x + 1} — use . digits or X`);
    })
  );
}

export function buildPatternPlan(stencilText, { offsetWeeks = 0, now = new Date() } = {}) {
  const grid = parseStencil(stencilText);
  const origin = gridOrigin(now);
  const plan = [];

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const count = grid[y][x];
      if (count === 0) continue;
      const date = cellDate(origin, x + offsetWeeks, y);
      if (isFuture(date, now)) continue; // silently clip anything past today
      for (let i = 0; i < count; i++) plan.push(date.toISOString());
    }
  }
  return plan.sort();
}