import { S3Client } from "@aws-sdk/client-s3";
import { env } from "./env";

export const cloudFlareStorageConnectionAdapter = new S3Client({
  endpoint: env.CLOUD_FLARE_BUCKET_URL,
  region: "auto",
  credentials: {
    accessKeyId: env.CLOUD_FLARE_R2_PUBLIC_KEY,
    secretAccessKey: env.CLOUD_FLARE_R2_SECRET_KEY,
  },
});
