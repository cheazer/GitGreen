import jsonfile from "jsonfile";
import simpleGit from "simple-git";

const DATA_PATH = "./data.json";

export async function execute(plan, { dryRun = false, repoPath = ".", log = console.log } = {}) {
  const days = new Set(plan.map((d) => d.slice(0, 10))).size;
  log(`${plan.length} commits planned across ${days} days`);

  if (dryRun) {
    plan.forEach((d) => log(`[dry-run] ${d}`));
    return { committed: 0, pushed: false };
  }
  const git = simpleGit(repoPath);

  for (let i = 0; i < plan.length; i++) {
    const date = plan[i];
    await jsonfile.writeFile(`${repoPath}/data.json`, { date, seq: i });
    await git
      .env({ ...process.env, GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date })
      .add(["data.json"])
      .commit(date);
    process.stdout.write(`\r[${i + 1}/${plan.length}] ${date}   `);
  }
  log("\npushing...");
  await git.push();
  log("done ✅");
  return { committed: plan.length, pushed: true };
}