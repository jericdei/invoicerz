import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const invoices = sqliteTable("invoices", {
  id: integer().primaryKey({ autoIncrement: true }),
  invoice_no: integer().notNull(),
  date: text().notNull(),
  from: text().notNull(),
  to: text().notNull(),
  amount: text().notNull(),
  path: text().notNull(),
});
