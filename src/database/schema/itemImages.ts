import { relations } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { items } from "./items";

export const itemImages = pgTable("item_images", {
  id: uuid().primaryKey().defaultRandom(),
  foundItemId: uuid()
    .notNull()
    .references(() => items.id),
  filename: varchar().notNull(),
  fileKey: varchar().notNull(),
  created_at: timestamp().defaultNow().notNull(),
});

export const itemImagesRelations = relations(itemImages, ({ one }) => ({
  foundItem: one(items, {
    fields: [itemImages.foundItemId],
    references: [items.id],
  }),
}));
