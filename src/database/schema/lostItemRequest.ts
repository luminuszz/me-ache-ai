import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

export const requestStatus = pgEnum("request_status", ["pending", "finished"]);

export const lostItemRequests = pgTable("lost_item_requests", {
  id: uuid().primaryKey().defaultRandom(),
  description: varchar().notNull(),
  name: varchar().notNull(),
  lostLocationDescription: varchar().notNull(),
  created_at: timestamp().defaultNow().notNull(),
  cpf: varchar().notNull(),
  requestStatus: requestStatus().notNull().default("pending"),
  userId: text()
    .references(() => users.id)
    .notNull(),
});

export const lostItemRequestRelations = relations(lostItemRequests, ({ one }) => {
  return {
    user: one(users, {
      fields: [lostItemRequests.userId],
      references: [users.id],
    }),
  };
});
