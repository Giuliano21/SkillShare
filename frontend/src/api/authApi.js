// API per il refresh del token di accesso.
import { http, setAccessToken } from "./http";

let refreshPromise = null;

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
