import { cloudFlareStorageProvider } from "@/providers/cloud-flare-storage-provider";
import { storageProviderKey } from "@/use-cases/contracts/storage-provider";

const contextMap = new Map<symbol, unknown>();

export const dependenceInjector = {
  register<InstanceType>(key: symbol, instance: InstanceType) {
    contextMap.set(key, instance);
  },
  resolve<InstanceType>(key: symbol): InstanceType {
    const instance = contextMap.get(key);

    if (!instance) {
      throw new Error(`Instance not found for key: ${key.toString()}`);
    }

    return instance as InstanceType;
  },
};

// register in context
dependenceInjector.register(storageProviderKey, cloudFlareStorageProvider);
