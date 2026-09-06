import { io } from "socket.io-client";
import { getAccessToken } from "./http";

const SOCKET_URL = (
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000/api/v1"
).replace(/\/api\/v1\/?$/, "");

export const createChatSocket = () =>
  io(SOCKET_URL, {
    auth: { token: getAccessToken() },
    transports: ["websocket"],
  });
