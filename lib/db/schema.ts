import { pgTable, uuid, text, numeric, jsonb, boolean, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }),
  images: jsonb("images").$type<string[]>().default([]),
  category: text("category"),
  origin: text("origin"), // 'KR' | 'US' | 'GB' | 'JP' | 'Other'
  inStock: boolean("in_stock").default(true),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => sql`now()`),
});

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").unique().notNull(),
  slug: text("slug").unique().notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Category = typeof categories.$inferSelect;
