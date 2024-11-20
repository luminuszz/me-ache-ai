import { relations } from "drizzle-orm";
import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { itemImages } from "./itemImages";

export const status = pgEnum("status", ["lost", "found"]);

export const items = pgTable("items", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar().notNull(),
  description: varchar().notNull(),
  locationDescription: varchar().notNull(),
  created_at: timestamp().defaultNow().notNull(),
  status: status().notNull().default("lost"),
});

export const itemRelations = relations(items, ({ many }) => ({
  images: many(itemImages),
}));
