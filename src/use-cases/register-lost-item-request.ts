"use server";

import { auth } from "@/auth/nextAuth";
import { db } from "@/database/db";
import { lostItemRequests } from "@/database/schema";
import { errors, left, right } from "@/lib/utils";
import dayjs from "dayjs";
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

  const session = await auth();

  if (!session || !session?.user?.id) {
    return left(errors.unauthorized());
  }

  if (!result.success) {
    return left(errors.invalidInput(result.error));
  }

  const userId = session.user.id ?? "";

  const eighthHoursAgo = dayjs().subtract(8, "hour").toDate();

  const userCannotRegisterLostItem = await db.query.lostItemRequests.findFirst({
    where(entity, { eq, and, gte }) {
      return and(eq(entity.userId, userId), gte(entity.created_at, eighthHoursAgo));
    },
  });

  if (userCannotRegisterLostItem) {
    return left(errors.quoteLimitExceeded());
  }

  const { description, lostLocationDescription, title, cpf } = result.data;

  await db.insert(lostItemRequests).values({
    description,
    name: title,
    cpf,
    lostLocationDescription,
    userId: session.user.id,
  });

  return right(null);
}
