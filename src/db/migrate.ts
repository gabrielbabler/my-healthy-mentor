import "dotenv/config";
import crypto from "crypto";
import path from "path";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, pgClient } from "./index";
import { allowlistEntries } from "./schema";

function parseSeedEmails(): string[] {
  const raw = [
    process.env.ADMIN_EMAIL ?? "",
    ...(process.env.ALLOWED_EMAILS ?? "").split(","),
  ];

  const normalized = raw
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.length > 0 && email.includes("@"));

  return Array.from(new Set(normalized));
}

export async function runMigrationsAndSeed() {
  const migrationsFolder = path.resolve(process.cwd(), "drizzle");
  console.log(`[db] Running Drizzle migrations from ${migrationsFolder}...`);
  await migrate(db, { migrationsFolder });

  const seedEmails = parseSeedEmails();
  for (const email of seedEmails) {
    await db
      .insert(allowlistEntries)
      .values({
        id: crypto.randomUUID(),
        email,
      })
      .onConflictDoNothing({ target: allowlistEntries.email });
  }

  console.log(
    `[db] Migrations complete. Seeded/verified ${seedEmails.length} allowlist email(s).`
  );
}

const isDirectRun =
  typeof require !== "undefined" && require.main === module
    ? true
    : process.argv[1]?.endsWith("migrate.ts") ||
      process.argv[1]?.endsWith("migrate.js");

if (isDirectRun) {
  runMigrationsAndSeed()
    .then(async () => {
      await pgClient.end();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error("[db] Migration failed:", err);
      await pgClient.end();
      process.exit(1);
    });
}
