/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BRAND_NAME?: string;
  readonly VITE_BRAND_INITIALS?: string;
  readonly VITE_PRODUCT_NAME?: string;
  readonly VITE_PRODUCT_LABEL?: string;
  readonly VITE_PRODUCT_TAGLINE?: string;
  readonly VITE_PRODUCT_DESCRIPTION?: string;
  readonly VITE_SUPPORT_EMAIL?: string;
  readonly VITE_APPWRITE_ENDPOINT?: string;
  readonly VITE_APPWRITE_PROJECT_ID?: string;
  readonly VITE_APPWRITE_DATABASE_ID?: string;
  readonly VITE_APPWRITE_ENQUIRIES_COLLECTION_ID?: string;
  readonly VITE_APPWRITE_USERS_COLLECTION_ID?: string;
  readonly VITE_APPWRITE_STORAGE_BUCKET_ID?: string;
  readonly VITE_APPWRITE_ADMIN_TEAM_ID?: string;
  readonly VITE_APPWRITE_WHITE_LABEL_COLLECTION_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
