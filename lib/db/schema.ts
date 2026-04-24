import {
  pgTable,
  uuid,
  text,
  numeric,
  jsonb,
  boolean,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }),
  images: jsonb("images").$type<string[]>().default([]),
  category: text("category"),
  collectionSlug: text("collection_slug"),
  origin: text("origin"), // 'KR' | 'US' | 'GB' | 'JP' | 'Other'
  inStock: boolean("in_stock").default(true),
  featured: boolean("featured").default(false),
  isNewArrival: boolean("is_new_arrival").default(false),
  isBackInStock: boolean("is_back_in_stock").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => sql`now()`),
});

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").unique().notNull(),
  slug: text("slug").unique().notNull(),
  description: text("description"),
  image: text("image"),
  sortOrder: integer("sort_order").default(0),
});

export const coupons = pgTable("coupons", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").unique().notNull(),
  type: text("type").$type<"percent" | "fixed">().notNull(),
  value: integer("value").notNull(),
  label: text("label").notNull(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => sql`now()`),
});

export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull(),
  customerName: text("customer_name").notNull(),
  rating: integer("rating").notNull(),
  review: text("review").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type Coupon = typeof coupons.$inferSelect;
export type NewCoupon = typeof coupons.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
