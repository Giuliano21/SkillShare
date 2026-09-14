import { io } from "socket.io-client";
import { getAccessToken } from "./http";

const SOCKET_URL = 
  import.meta.env.VITE_SOCKET_URL ||
  window.location.origin;

export const createChatSocket = () =>
  io(SOCKET_URL, {
    auth: { token: getAccessToken() },
    transports: ["websocket"],
  });
