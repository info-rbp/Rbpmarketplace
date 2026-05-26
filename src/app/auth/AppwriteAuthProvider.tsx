import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Models } from 'appwrite';
import { isAppwriteConfigured } from '@/config/appwrite';
import { getAppwriteAccount } from '@/lib/appwrite/client';

interface AppwriteAuthContextValue {
  configured: boolean;
  loading: boolean;
  user: Models.User<Models.Preferences> | null;
  error: string | null;
  refreshSession: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AppwriteAuthContext = createContext<AppwriteAuthContextValue | null>(null);

export function AppwriteAuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(isAppwriteConfigured);
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refreshSession() {
    if (!isAppwriteConfigured) {
      setUser(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const account = getAppwriteAccount();
      const nextUser = await account.get();
      setUser(nextUser);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    const account = getAppwriteAccount();
    setError(null);
    await account.createEmailPasswordSession(email, password);
    await refreshSession();
  }

  async function signOut() {
    if (!isAppwriteConfigured) {
      setUser(null);
      return;
    }

    const account = getAppwriteAccount();
    await account.deleteSession('current');
    setUser(null);
  }

  useEffect(() => {
    refreshSession().catch((sessionError) => {
      setError(
        sessionError instanceof Error
          ? sessionError.message
          : 'Appwrite session could not be checked.',
      );
      setLoading(false);
    });
  }, []);

  const value = useMemo<AppwriteAuthContextValue>(
    () => ({
      configured: isAppwriteConfigured,
      loading,
      user,
      error,
      refreshSession,
      signIn,
      signOut,
    }),
    [error, loading, user],
  );

  return (
    <AppwriteAuthContext.Provider value={value}>{children}</AppwriteAuthContext.Provider>
  );
}

export function useAppwriteAuth() {
  const context = useContext(AppwriteAuthContext);
  if (!context) {
    throw new Error('useAppwriteAuth must be used inside AppwriteAuthProvider.');
  }

  return context;
}
