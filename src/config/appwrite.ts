export interface AppwriteRuntimeConfig {
  endpoint?: string;
  projectId?: string;
  databaseId?: string;
  enquiriesCollectionId?: string;
  usersCollectionId?: string;
  storageBucketId?: string;
  adminTeamId?: string;
  whiteLabelCollectionId?: string;
}

function readOptionalEnv(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export const appwriteConfig: AppwriteRuntimeConfig = {
  endpoint: readOptionalEnv(import.meta.env.VITE_APPWRITE_ENDPOINT),
  projectId: readOptionalEnv(import.meta.env.VITE_APPWRITE_PROJECT_ID),
  databaseId: readOptionalEnv(import.meta.env.VITE_APPWRITE_DATABASE_ID),
  enquiriesCollectionId: readOptionalEnv(
    import.meta.env.VITE_APPWRITE_ENQUIRIES_COLLECTION_ID,
  ),
  usersCollectionId: readOptionalEnv(import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID),
  storageBucketId: readOptionalEnv(import.meta.env.VITE_APPWRITE_STORAGE_BUCKET_ID),
  adminTeamId: readOptionalEnv(import.meta.env.VITE_APPWRITE_ADMIN_TEAM_ID),
  whiteLabelCollectionId: readOptionalEnv(
    import.meta.env.VITE_APPWRITE_WHITE_LABEL_COLLECTION_ID,
  ),
};

export const isAppwriteConfigured = Boolean(
  appwriteConfig.endpoint && appwriteConfig.projectId,
);

export const hasAppwriteDataModelConfig = Boolean(
  appwriteConfig.databaseId &&
    appwriteConfig.enquiriesCollectionId &&
    appwriteConfig.usersCollectionId,
);
