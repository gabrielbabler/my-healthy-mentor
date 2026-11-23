import "dotenv/config";
import { runMigrationsAndSeed } from "./db/migrate";
import { pgClient } from "./db";

const TICK_INTERVAL_MS = 60_000;

async function tick() {
  // Phase 3 will evaluate due daily_digest, evening_checkin, and weekly_reminder jobs
  // using idempotent scheduled_dispatches locks.
}

async function main() {
  console.log("[scheduler] Starting My Healthy Mentor scheduler...");
  await runMigrationsAndSeed();

  await tick();
  const interval = setInterval(() => {
    tick().catch((err) => {
      console.error("[scheduler] Tick error:", err);
    });
  }, TICK_INTERVAL_MS);

  const shutdown = async () => {
    console.log("[scheduler] Shutting down...");
    clearInterval(interval);
    await pgClient.end();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch(async (err) => {
  console.error("[scheduler] Fatal startup error:", err);
  await pgClient.end();
  process.exit(1);
});
