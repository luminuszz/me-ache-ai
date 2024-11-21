import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.string().default("dev"),
  DATABASE_URL: z.string(),
  CLOUD_FLARE_BUCKET_URL: z.string(),
  CLOUD_FLARE_BUCKET_PUBLIC_URL: z.string(),
  CLOUD_FLARE_R2_SECRET_KEY: z.string(),
  CLOUD_FLARE_R2_PUBLIC_KEY: z.string(),
  CLOUD_FLARE_BUCKET_NAME: z.string(),
  DATABASE_POOLED_CONNECTION_URL: z.string(),
  AUTH_DRIZZLE_URL: z.string(),
  AUTH_GITHUB_ID: z.string(),
  AUTH_GITHUB_SECRET: z.string(),
  AUTH_SECRET: z.string(),
});

export type EnvType = z.infer<typeof envSchema>;
export const env = envSchema.parse(process.env);
