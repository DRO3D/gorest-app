import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface AuthContextValue {
  token: string;
  setToken: (t: string) => void;
  clearToken: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'gorest_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string>(
    () => localStorage.getItem(STORAGE_KEY) ?? ''
  );

  const setToken = useCallback((t: string) => {
    setTokenState(t);
    localStorage.setItem(STORAGE_KEY, t);
  }, []);

  const clearToken = useCallback(() => {
    setTokenState('');
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken, clearToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
