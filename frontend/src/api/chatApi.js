/* chatApi.js gestisce le chiamate API per le operazioni relative alle chat, come la creazione di conversazioni,
l'invio di messaggi e la gestione delle conversazioni. */
import { http } from "./http";

export const listMyConversations = () => http("/chats/conversations");

export const createOrGetConversation = (peerUserId) =>
  http(`/chats/conversations/with/${peerUserId}`, {
    method: "POST",
  });

export const getConversationMessages = (conversationId) =>
  http(`/chats/conversations/${conversationId}/messages`);

export const sendMessage = (conversationId, data) =>
  http(`/chats/conversations/${conversationId}/messages`, {
    method: "POST",
    body: data,
  });

export const markConversationAsRead = (conversationId) =>
  http(`/chats/conversations/${conversationId}/read`, {
    method: "PATCH",
  });
