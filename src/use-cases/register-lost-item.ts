import { db } from "@/database/db";
import { lostItems } from "@/database/schema";
import { errors, left, right } from "@/lib/utils";
import { z } from "zod";

export const registerLostItemSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  locationDescription: z.string().min(1).max(1000),
});

export type RegisterLostItemInput = z.infer<typeof registerLostItemSchema>;

export async function registerLostItem(params: RegisterLostItemInput) {
  const result = registerLostItemSchema.safeParse(params);

  if (!result.success) {
    return left(errors.invalidInput(result.error));
  }

  const { description, locationDescription, title } = result.data;

  await db.insert(lostItems).values({
    description,
    locationDescription,
    name: title,
  });

  return right(null);
}
