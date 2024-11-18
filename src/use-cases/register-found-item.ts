"use server";

import { db } from "@/database/db";
import { foundItems } from "@/database/schema";
import { errors, left, right } from "@/lib/utils";
import { z } from "zod";

const registerFoundItemSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  locationDescription: z.string().min(1).max(1000),
});

export type RegisterFoundItemInput = z.infer<typeof registerFoundItemSchema>;

export async function registerFoundItem(params: RegisterFoundItemInput) {
  const result = registerFoundItemSchema.safeParse(params);

  if (!result.success) {
    return left(errors.invalidInput(result.error));
  }

  const { description, locationDescription, title } = result.data;

  const [{ foundItemId }] = await db
    .insert(foundItems)
    .values({
      description,
      locationDescription,
      name: title,
    })
    .returning({ foundItemId: foundItems.id });

  console.log({ foundItemId });

  return right({ foundItemId });
}
