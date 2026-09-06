const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1"
).replace(/\/$/, "");

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const http = async (endpoint, options = {}) => {
  const { method = "GET", body, ...rest } = options;

  const headers = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;
  const response = await fetch(`${API_BASE_URL}${normalizedEndpoint}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: "include",
    ...rest,
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof payload === "object" ? payload.message : payload;
    throw new Error(message || `Errore API (${response.status})`);
  }

  return payload;
};
