import { useState, useEffect } from "react";
import { http, setAccessToken, getAccessToken } from "../api/http";
import { refreshToken } from "../api/authApi";
import { AuthContext } from "./AuthContext";

// AuthProvider è un componente che fornisce il contesto di autenticazione ai componenti figli.
// Gestisce lo stato dell'utente, il caricamento e le funzioni di registrazione, login e logout.

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const tryRefresh = async () => {
      try {
        await refreshToken();

        const profile = await http("/users/profile");
        setUser(profile.user);
      } catch (err) {
        console.error("Nessuna sessione attiva:", err);
      } finally {
        setLoading(false);
      }
    };
    tryRefresh();
  }, []);

  const register = async (formData) => {
    setActionLoading(true);
    try {
      const data = await http("/auth/register", {
        method: "POST",
        body: formData,
      });
      return data;
    } finally {
      setActionLoading(false);
    }
  };

  const login = async (email, password) => {
    setActionLoading(true);
    try {
      const data = await http("/auth/login", {
        method: "POST",
        body: { email, password },
      });
      setAccessToken(data.accessToken);
      setUser(data.user);
      return data;
    } finally {
      setActionLoading(false);
    }
  };

  const logout = async () => {
    try {
      await http("/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout fallito:", err);
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    actionLoading,
    register,
    login,
    logout,
    isAuthenticated: !!getAccessToken(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
