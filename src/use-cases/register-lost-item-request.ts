"use server";

import { db } from "@/database/db";
import { lostItemRequests } from "@/database/schema";
import { errors, left, right } from "@/lib/utils";
import { z } from "zod";

const registerLostItemSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  lostLocationDescription: z.string().min(1).max(1000),
  cpf: z.string().regex(/^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/),
});

export type RegisterLostItemInput = z.infer<typeof registerLostItemSchema>;

export async function registerLostItemRequest(params: RegisterLostItemInput) {
  const result = registerLostItemSchema.safeParse(params);

  if (!result.success) {
    return left(errors.invalidInput(result.error));
  }

  const { description, lostLocationDescription, title, cpf } = result.data;

  await db.insert(lostItemRequests).values({
    description,
    name: title,
    cpf,
    lostLocationDescription,
  });

  return right(null);
}
