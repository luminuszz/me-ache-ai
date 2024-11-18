import { cloudFlareStorageConnectionAdapter } from "@/lib/cloud-flare-r2";
import { env } from "@/lib/env";
import { StorageFile, StorageProvider } from "@/use-cases/contracts/storage-provider";
import { PutObjectCommand } from "@aws-sdk/client-s3";

import { createId } from "@paralleldrive/cuid2";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

type SaveFilesResponse = Array<{ filename: string; saveFileUrlIntent: string; storageUrl: string; fileKey: string }>;

export const cloudFlareStorageProvider: StorageProvider = {
  async saveFilesIntent(files: StorageFile[]): Promise<SaveFilesResponse> {
    const storageUrls: SaveFilesResponse = [];

    for (const file of files) {
      const fileKey = createId().concat(file.name).concat(".jpeg");

      const puts3Command = new PutObjectCommand({
        Bucket: env.CLOUD_FLARE_BUCKET_NAME,
        Key: fileKey,
        ContentType: "image/jpeg",
      });

      const url = await getSignedUrl(cloudFlareStorageConnectionAdapter, puts3Command, { expiresIn: 600 });
      storageUrls.push({
        fileKey,
        filename: file.name,
        saveFileUrlIntent: url,
        storageUrl: `${env.CLOUD_FLARE_BUCKET_PUBLIC_URL}/${env.CLOUD_FLARE_BUCKET_NAME}/${fileKey}`,
      });
    }

    return storageUrls;
  },
};
