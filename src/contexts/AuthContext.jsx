import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on first mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('auth_user');
      if (stored) setUser(JSON.parse(stored));
    } catch (e) {
      console.warn('Failed to restore auth session', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async ({ email, password: _password }) => {
    // TODO: replace with real API call
    await Promise.resolve(); // simulates network delay
    const fakeUser = { id: 1, email, name: email.split('@')[0] };
    localStorage.setItem('auth_user', JSON.stringify(fakeUser));
    setUser(fakeUser);
    return fakeUser;
  };

  const register = async ({ name, email, password: _password }) => {
    // TODO: replace with real API call
    await Promise.resolve(); // simulates network delay
    const fakeUser = { id: Date.now(), email, name };
    localStorage.setItem('auth_user', JSON.stringify(fakeUser));
    setUser(fakeUser);
    return fakeUser;
  };

  const logout = () => {
    localStorage.removeItem('auth_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside an <AuthProvider>');
  return ctx;
}
