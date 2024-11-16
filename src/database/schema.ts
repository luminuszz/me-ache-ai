import { InferSelectModel, relations } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const lostItems = pgTable("lost_item", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar().notNull(),
  description: varchar().notNull(),
  locationDescription: varchar().notNull(),
  created_at: timestamp().defaultNow().notNull(),
});

export const foundItems = pgTable("found_item", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar().notNull(),
  description: varchar().notNull(),
  locationDescription: varchar().notNull(),
  created_at: timestamp().defaultNow().notNull(),
});

export const foundItemImages = pgTable("lost_item_images", {
  id: uuid().primaryKey().defaultRandom(),
  foundItemId: uuid()
    .notNull()
    .references(() => foundItems.id),
  filename: varchar().notNull(),
  fileKey: varchar().notNull(),
  created_at: timestamp().defaultNow().notNull(),
});

export const foundItemRelations = relations(foundItems, ({ many }) => ({
  images: many(foundItemImages),
}));

export const foundItemImagesRelations = relations(foundItemImages, ({ one }) => ({
  foundItem: one(foundItems, {
    fields: [foundItemImages.foundItemId],
    references: [foundItems.id],
  }),
}));

export type LostItem = InferSelectModel<typeof lostItems>;
export type FoundItem = InferSelectModel<typeof foundItems>;
export type FoundItemImage = InferSelectModel<typeof foundItemImages>;
