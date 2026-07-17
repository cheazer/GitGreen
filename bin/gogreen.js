import { buildRandomPlan } from "../src/plan.js";
import { execute } from "../src/executor.js";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");

const plan = buildRandomPlan({ total: 100, maxPerDay: 4 });
await execute(plan, { dryRun });