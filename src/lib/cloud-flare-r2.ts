import { S3Client } from "@aws-sdk/client-s3";
import { env } from "./env";

export const cloudFlareStorageConnectionAdapter = new S3Client({
  endpoint: env.CLOUD_FLARE_BUCKET_URL,
});
