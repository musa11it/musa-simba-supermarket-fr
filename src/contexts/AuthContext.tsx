import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import api from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  googleLogin: (data: GoogleLoginData) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  language?: string;
}

interface GoogleLoginData {
  email: string;
  name: string;
  googleId: string;
  avatar?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('simba_token');
    const storedUser = localStorage.getItem('simba_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        // Verify token is still valid
        api.get('/auth/me').then((res) => {
          if (res.success) {
            setUser(res.data);
            localStorage.setItem('simba_user', JSON.stringify(res.data));
          }
        }).catch(() => {
          localStorage.removeItem('simba_token');
          localStorage.removeItem('simba_user');
          setToken(null);
          setUser(null);
        });
      } catch {
        localStorage.removeItem('simba_token');
        localStorage.removeItem('simba_user');
      }
    }
    setIsLoading(false);
  }, []);

  const setAuth = (newUser: User, newToken: string) => {
    localStorage.setItem('simba_token', newToken);
    localStorage.setItem('simba_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    if (!res.success) throw new Error(res.message);
    setAuth(res.data.user, res.data.token);
  };

  const register = async (data: RegisterData) => {
    const res = await api.post('/auth/register', data);
    if (!res.success) throw new Error(res.message);
    setAuth(res.data.user, res.data.token);
  };

  const googleLogin = async (data: GoogleLoginData) => {
    const res = await api.post('/auth/google', data);
    if (!res.success) throw new Error(res.message);
    setAuth(res.data.user, res.data.token);
  };

  const forgotPassword = async (email: string) => {
    const res = await api.post('/auth/forgot-password', { email });
    if (!res.success) throw new Error(res.message);
  };

  const logout = () => {
    localStorage.removeItem('simba_token');
    localStorage.removeItem('simba_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    localStorage.setItem('simba_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        googleLogin,
        forgotPassword,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
