import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/my_healthy_mentor";

const globalForDb = globalThis as unknown as {
  pgClient: ReturnType<typeof postgres> | undefined;
};

export const pgClient =
  globalForDb.pgClient ??
  postgres(connectionString, {
    max: 10,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.pgClient = pgClient;
}

export const db = drizzle(pgClient, { schema });
export type Database = typeof db;
