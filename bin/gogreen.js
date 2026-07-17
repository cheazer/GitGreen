import { Command } from "commander";
import { buildRandomPlan } from "../src/plan.js";
import { execute } from "../src/executor.js";

const program = new Command();

program
  .name("gogreen")
  .description("🌱 Paint your GitHub contribution graph")
  .version("0.2.0")
  .option("-c, --commits <n>", "total commits to create", "100")
  .option("-m, --max-per-day <n>", "max commits on a single day (controls shade)", "4")
  .option("-w, --weeks <n>", "how many weeks back to spread across", "52")
  .option("-r, --repo <path>", "path to the git repo to commit into", ".")
  .option("-d, --dry-run", "show the plan without committing anything", false);

program.parse();
const opts = program.opts();

const total = parseInt(opts.commits, 10);
const maxPerDay = parseInt(opts.maxPerDay, 10);
const weeks = parseInt(opts.weeks, 10);

if ([total, maxPerDay, weeks].some(Number.isNaN) || total < 1 || maxPerDay < 1 || weeks < 1 || weeks > 53) {
  console.error("error: --commits, --max-per-day and --weeks must be positive numbers (weeks ≤ 53)");
  process.exit(1);
}

const plan = buildRandomPlan({ total, maxPerDay, weeks });
await execute(plan, { dryRun: opts.dryRun, repoPath: opts.repo });