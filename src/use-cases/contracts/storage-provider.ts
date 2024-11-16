export type StorageFile = {
  type: string;
  name: string;
};

export const storageProviderKey = Symbol("StorageProvider");

export interface StorageProvider {
  saveFilesIntent(files: StorageFile[]): Promise<{ filename: string; saveFileUrlIntent: string; storageUrl: string; fileKey: string }[]>;
}
