import { describe, it, expect } from "vitest";
import { gridOrigin, cellDate, dateToCell } from "../src/dates.js";
import { buildRandomPlan, planToDayCounts } from "../src/plan.js";
import { parseStencil, buildPatternPlan } from "../src/pattern.js";
import { textToStencil } from "../src/font.js";

const NOW = new Date("2026-07-17T10:00:00Z");

describe("dates", () => {
  it("origin is always a Sunday", () => {
    expect(gridOrigin(NOW).getDay()).toBe(0);
  });

  it("cellDate and dateToCell are inverses", () => {
    const origin = gridOrigin(NOW);
    const d = cellDate(origin, 13, 4);
    expect(dateToCell(origin, d)).toEqual({ x: 13, y: 4 });
  });
});

describe("plan", () => {
  it("creates exactly the requested number of commits", () => {
    const plan = buildRandomPlan({ total: 57, now: NOW, rng: () => 0.5 });
    expect(plan.length).toBe(57);
  });

  it("never schedules the future", () => {
    const plan = buildRandomPlan({ total: 200, now: NOW });
    expect(plan.every((d) => new Date(d) <= NOW)).toBe(true);
  });

  it("is sorted chronologically", () => {
    const plan = buildRandomPlan({ total: 50, now: NOW });
    expect(plan).toEqual([...plan].sort());
  });

  it("day counts add up to the plan length", () => {
    const plan = buildRandomPlan({ total: 80, now: NOW });
    const total = [...planToDayCounts(plan).values()].reduce((a, b) => a + b, 0);
    expect(total).toBe(80);
  });
});

describe("stencil", () => {
  it("parses characters into counts", () => {
    expect(parseStencil("X.3")).toEqual([[4, 0, 3]]);
  });

  it("rejects 8-row stencils", () => {
    expect(() => parseStencil("X\nX\nX\nX\nX\nX\nX\nX")).toThrow(/7/);
  });

  it("rejects unknown characters with coordinates", () => {
    expect(() => parseStencil("X?")).toThrow(/row 1, col 2/);
  });

  it("a 2-commit cell produces 2 identical dates", () => {
    const plan = buildPatternPlan("2", { now: NOW });
    expect(plan.length).toBe(2);
    expect(plan[0]).toBe(plan[1]);
  });
});

describe("font", () => {
  it("always outputs 7 rows", () => {
    expect(textToStencil("HI").split("\n").length).toBe(7);
  });

  it("throws on characters without glyphs", () => {
    expect(() => textToStencil("A!")).toThrow(/glyph/);
  });

  it("round-trips through the stencil parser", () => {
    expect(() => parseStencil(textToStencil("FANU"))).not.toThrow();
  });
});