// http è il modulo per effettuare chiamate HTTP all'API 
const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "api/v1"
).replace(/\/$/, "");

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

// http permette di effettuare richieste HTTP all'API, gestendo l'autenticazione tramite token di accesso.
export const http = async (endpoint, options = {}) => {
  const { method = "GET", body, ...rest } = options;

  const headers = {
    "Content-Type": "application/json",
  };
  // Se è presente un token di accesso, aggiungilo all'header Authorization
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  
  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;
    // Effettua la richiesta HTTP all'API, includendo il token di accesso se presente, e gestisce la risposta.
  const response = await fetch(`${API_BASE_URL}${normalizedEndpoint}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: "include",
    ...rest,
  });
// Controlla il tipo di contenuto della risposta e restituisce il payload appropriato (JSON o testo).
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
