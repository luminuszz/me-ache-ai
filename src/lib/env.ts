import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.string().default("dev"),
  DATABASE_URL: z.string(),
  CLOUD_FLARE_BUCKET_URL: z.string(),
  CLOUD_FLARE_BUCKET_PUBLIC_URL: z.string(),
  CLOUD_FLARE_BUCKET_NAME: z.string(),
});

export const env = envSchema.parse(process.env);
