/**
 * Applies SQL migrations in ./drizzle to DATABASE_URL, or to the embedded
 * PGlite database when DATABASE_URL is unset (local development).
 *
 * With --build (the production build runs it that way) it only touches a real
 * database: a deploy with DATABASE_URL set gets its tables created or updated,
 * and a build without one skips the step.
 */
import { join } from "node:path";

const folder = join(import.meta.dirname, "..", "drizzle");
const url = process.env.DATABASE_URL?.trim();

if (!url && process.argv.includes("--build")) {
  console.log("migrations skipped: DATABASE_URL is not set");
} else if (url) {
  const { default: postgres } = await import("postgres");
  const { drizzle } = await import("drizzle-orm/postgres-js");
  const { migrate } = await import("drizzle-orm/postgres-js/migrator");
  const client = postgres(url, { max: 1 });
  await migrate(drizzle(client), { migrationsFolder: folder });
  await client.end();
  console.log("migrations applied");
} else {
  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle } = await import("drizzle-orm/pglite");
  const { migrate } = await import("drizzle-orm/pglite/migrator");
  const dir = process.env.PGLITE_DIR?.trim() || join(import.meta.dirname, "..", ".data", "pglite");
  const { mkdirSync } = await import("node:fs");
  mkdirSync(dir, { recursive: true });
  const client = new PGlite(dir);
  await migrate(drizzle(client), { migrationsFolder: folder });
  await client.close();
  console.log("migrations applied");
}
