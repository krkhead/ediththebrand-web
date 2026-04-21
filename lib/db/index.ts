import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function getDb() {
  const url = process.env.NEON_DATABASE_URL;
  if (!url || url === "your_neon_database_url") {
    throw new Error("NEON_DATABASE_URL is not configured");
  }
  const sql = neon(url);
  return drizzle(sql, { schema });
}

// Lazy singleton — instantiated on first use, not at module load
let _db: ReturnType<typeof getDb> | null = null;
export const db = new Proxy({} as ReturnType<typeof getDb>, {
  get(_target, prop) {
    if (!_db) _db = getDb();
    return (_db as never)[prop as never];
  },
});
