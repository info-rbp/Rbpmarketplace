import type { ReactNode } from 'react';
import { AppwriteAuthProvider } from '@/app/auth/AppwriteAuthProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  return <AppwriteAuthProvider>{children}</AppwriteAuthProvider>;
}
