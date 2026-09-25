import "server-only";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

/**
 * Production uses DATABASE_URL (any Postgres; Neon's pooled URL works).
 * Without it, development runs on an embedded PGlite database in .data/,
 * so the whole app works locally with zero setup.
 */
function create() {
  const url = process.env.DATABASE_URL;
  if (url) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const postgres = require("postgres") as typeof import("postgres");
    const client = postgres(url, { max: 5, prepare: false });
    return drizzlePostgres(client, { schema });
  }
  if (process.env.NODE_ENV === "production" && !process.env.ALLOW_EMBEDDED_DB) {
    throw new Error("DATABASE_URL is not set");
  }
  const dir = process.env.PGLITE_DIR ?? ".data/pglite";
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  (require("node:fs") as typeof import("node:fs")).mkdirSync(dir, { recursive: true });
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PGlite } = require("@electric-sql/pglite") as typeof import("@electric-sql/pglite");
  return drizzlePglite(new PGlite(dir), { schema });
}

type DB = ReturnType<typeof drizzlePostgres<typeof schema>>;

const globalForDb = globalThis as unknown as { __truehandDb?: DB };

function instance(): DB {
  globalForDb.__truehandDb ??= create() as unknown as DB;
  return globalForDb.__truehandDb;
}

/**
 * Connects on first use rather than on import, so building the app (which
 * imports every route) never needs a database.
 */
export const db: DB = new Proxy({} as DB, {
  get(_, prop) {
    const real = instance();
    const value = Reflect.get(real, prop, real);
    return typeof value === "function" ? value.bind(real) : value;
  },
});

export { schema };
