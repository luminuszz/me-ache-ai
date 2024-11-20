"use server";

import { db } from "@/database/db";
import { itemImages } from "@/database/schema";
import { dependenceInjector } from "@/lib/dependenceInjector";
import { left, right } from "@/lib/utils";
import { z } from "zod";
import { StorageProvider, storageProviderKey } from "./contracts/storage-provider";

const saveFoundItemImageSchema = z.object({
  images: z.array(
    z.object({
      filename: z.string(),
      contentType: z.string().regex(/^image\/.*/),
    })
  ),
  foundItemId: z.string(),
});

export type SaveFoundImageSchema = z.infer<typeof saveFoundItemImageSchema>;

export async function saveFoundImagesIntent(params: SaveFoundImageSchema) {
  try {
    const results = saveFoundItemImageSchema.safeParse(params);

    if (!results.success) {
      return left(results.error);
    }

    const storageProvider = dependenceInjector.resolve<StorageProvider>(storageProviderKey);

    const { images, foundItemId } = results.data;

    const uploadResults = await storageProvider.saveFilesIntent(
      images.map((item) => ({
        name: item.filename,
        type: item.contentType,
      }))
    );

    await db.insert(itemImages).values(
      uploadResults.map((item) => ({
        foundItemId,
        filename: item.filename,
        fileKey: item.fileKey,
      }))
    );

    const response = uploadResults.map((item) => ({
      uploadUrl: item.saveFileUrlIntent,
      fileKey: item.fileKey,
      filename: item.filename,
    }));

    return right(response);
  } catch (err) {
    return left(err);
  }
}
