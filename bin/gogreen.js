

import { readFileSync } from "node:fs";
import { Command } from "commander";
import { buildRandomPlan } from "../src/plan.js";
import { buildPatternPlan } from "../src/pattern.js";
import { textToStencil } from "../src/font.js";
import { renderPlan } from "../src/render.js";
import { execute } from "../src/executor.js";

const program = new Command();

program
  .name("gogreen")
  .description(" Paint your GitHub contribution graph")
  .version("0.4.0")
  .option("-c, --commits <n>", "total commits to create", "100")
  .option("-m, --max-per-day <n>", "max commits on a single day (controls shade)", "4")
  .option("-w, --weeks <n>", "how many weeks back to spread across", "52")
  .option("-r, --repo <path>", "path to the git repo to commit into", ".")
  .option("-s, --stencil <file>", "path to an ASCII stencil file to draw")
  .option("-t, --text <string>", "write text on the graph (letters + spaces)")
  .option("-o, --offset-weeks <n>", "slide stencil/text right by n weeks", "0")
  .option("-p, --preview", "render the graph the plan would produce", false)
  .option("-d, --dry-run", "show the plan without committing anything", false);

program.parse();
const opts = program.opts();

const total = parseInt(opts.commits, 10);
const maxPerDay = parseInt(opts.maxPerDay, 10);
const weeks = parseInt(opts.weeks, 10);
const offset = parseInt(opts.offsetWeeks, 10);

if ([total, maxPerDay, weeks, offset].some(Number.isNaN) || total < 1 || maxPerDay < 1 || weeks < 1 || weeks > 53 || offset < 0) {
  console.error("error: numeric flags must be positive numbers (weeks ≤ 53, offset ≥ 0)");
  process.exit(1);
}

// Plan source priority: text > stencil > random.
const plan = opts.text
  ? buildPatternPlan(textToStencil(opts.text), { offsetWeeks: offset })
  : opts.stencil
  ? buildPatternPlan(readFileSync(opts.stencil, "utf8"), { offsetWeeks: offset })
  : buildRandomPlan({ total, maxPerDay, weeks });

if (opts.preview || opts.dryRun) console.log(renderPlan(plan, { weeks }));

await execute(plan, { dryRun: opts.dryRun, repoPath: opts.repo });