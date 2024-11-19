import { InferSelectModel, relations } from "drizzle-orm";
import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const status = pgEnum("status", ["lost", "found"]);
export const requestStatus = pgEnum("request_status", ["pending", "finished"]);

export const items = pgTable("items", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar().notNull(),
  description: varchar().notNull(),
  locationDescription: varchar().notNull(),
  created_at: timestamp().defaultNow().notNull(),
  status: status().notNull().default("lost"),
});

export const itemImages = pgTable("item_images", {
  id: uuid().primaryKey().defaultRandom(),
  foundItemId: uuid()
    .notNull()
    .references(() => items.id),
  filename: varchar().notNull(),
  fileKey: varchar().notNull(),
  created_at: timestamp().defaultNow().notNull(),
});

export const itemRelations = relations(items, ({ many }) => ({
  images: many(itemImages),
}));

export const itemImagesRelations = relations(itemImages, ({ one }) => ({
  foundItem: one(items, {
    fields: [itemImages.foundItemId],
    references: [items.id],
  }),
}));

export const lostItemRequests = pgTable("lost_item_requests", {
  id: uuid().primaryKey().defaultRandom(),
  description: varchar().notNull(),
  name: varchar().notNull(),
  lostLocationDescription: varchar().notNull(),
  created_at: timestamp().defaultNow().notNull(),
  cpf: varchar().notNull(),
  requestStatus: requestStatus().notNull().default("pending"),
});

export type LostItem = InferSelectModel<typeof items>;
export type FoundItemImage = InferSelectModel<typeof itemImages>;
export type LostItemRequest = InferSelectModel<typeof lostItemRequests>;
