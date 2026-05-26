import { Account, Client } from 'appwrite';
import { appwriteConfig, isAppwriteConfigured } from '@/config/appwrite';

let client: Client | null = null;

export function getAppwriteClient() {
  if (!isAppwriteConfigured || !appwriteConfig.endpoint || !appwriteConfig.projectId) {
    throw new Error('Appwrite is not configured for this environment yet.');
  }

  if (!client) {
    client = new Client()
      .setEndpoint(appwriteConfig.endpoint)
      .setProject(appwriteConfig.projectId);
  }

  return client;
}

export function getAppwriteAccount() {
  return new Account(getAppwriteClient());
}
