import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { db } from "./src/db";

console.log("Migrating database...");

try {
  migrate(db, { migrationsFolder: "./src/db/migrations" });
  console.log("Migration complete!");
} catch (e) {
  console.error("Migration failed:", e);
  process.exit(1);
}
