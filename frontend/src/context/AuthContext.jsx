import { createContext, useState, useContext, useEffect } from 'react';
import { http, setAccessToken, getAccessToken } from '../api/http';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const data = await http('/auth/refresh', { method: 'POST' });
        setAccessToken(data.accessToken);
        
        const profile = await http('/users/profile');
        setUser(profile.user);
      } catch (err) {
        console.error('Nessuna sessione attiva:', err);
      } finally {
        setLoading(false);
      }
    };
    tryRefresh();
  }, []);

  const register = async (formData) => {
    setLoading(true);
    try {
      const data = await http('/auth/register', {
        method: 'POST',
        body: formData,
      });
      return data;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await http('/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      setAccessToken(data.accessToken);
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await http('/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout fallito:', err);
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!getAccessToken(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve essere dentro AuthProvider');
  return context;
};