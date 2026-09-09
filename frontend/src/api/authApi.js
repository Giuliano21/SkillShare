// API per l'autenticazione degli utenti, registrazione, login, logout e refresh del token di accesso.
import { http, setAccessToken } from "./http";

let refreshPromise = null;

export const register = (data) =>
  http("/auth/register", {
    method: "POST",
    body: data,
  });

export const login = (credentials) =>
  http("/auth/login", {
    method: "POST",
    body: credentials,
  }).then((response) => {
    // Salva il token di accesso nel client
    if (response.accessToken) {
      setAccessToken(response.accessToken);
    }
    return response;
  });

export const logout = () =>
  http("/auth/logout", {
    method: "POST",
  }).then((response) => {
    // Rimuovi il token di accesso
    setAccessToken(null);
    return response;
  });

export const refreshToken = () => {
  if (!refreshPromise) {
    refreshPromise = http("/auth/refresh", {
      method: "POST",
    })
      .then((response) => {
        if (response.accessToken) setAccessToken(response.accessToken);
        return response;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};
