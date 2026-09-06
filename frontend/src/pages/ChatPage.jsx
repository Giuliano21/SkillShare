import { useEffect, useRef, useState } from "react";
import {
  listMyConversations,
  getConversationMessages,
  sendMessage,
  markConversationAsRead,
} from "../api/chatApi";
import { createChatSocket } from "../api/chatSocket";

export const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const socketRef = useRef(null);
  const selectedRef = useRef(null);
  const load = async () => {
    const data = await listMyConversations();
    setConversations(data.conversations || []);
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      load().catch((err) => setError(err.message));
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    const connection = createChatSocket();
    socketRef.current = connection;
    connection.on("message:new", ({ conversationId, message }) => {
      if (conversationId === selectedRef.current?._id)
        setMessages((current) =>
          current.some((item) => item._id === message._id)
            ? current
            : [...current, message],
        );
      load().catch((err) => setError(err.message));
    });
    connection.on("connect_error", (err) => setError(err.message));
    return () => {
      connection.disconnect();
      socketRef.current = null;
    };
  }, []);
  const openConversation = async (conversation) => {
    const id = conversation._id;
    selectedRef.current = conversation;
    setSelected(conversation);
    const data = await getConversationMessages(id);
    setMessages((data.messages || data.items || []).reverse());
    await markConversationAsRead(id);
    socketRef.current?.emit("conversation:join", { conversationId: id });
  };
  const submit = async (event) => {
    event.preventDefault();
    if (!text.trim() || !selected) return;
    try {
      if (socketRef.current?.connected) {
        await new Promise((resolve, reject) =>
          socketRef.current.emit(
            "message:send",
            { conversationId: selected._id, text },
            (result) =>
              result?.ok
                ? resolve(result)
                : reject(new Error(result?.error || "Invio non riuscito")),
          ),
        );
      } else {
        const data = await sendMessage(selected._id, { text });
        setMessages((current) => [...current, data.data]);
      }
      setText("");
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div className="content-page chat-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Confrontati, chiedi, costruisci</p>
          <h1>Messaggi.</h1>
        </div>
      </div>
      {error && <p className="form-message error">{error}</p>}
      <div className="chat-layout">
        <aside className="conversation-list">
          {conversations.length ? (
            conversations.map((conversation) => (
              <button
                className={`conversation ${selected?._id === conversation._id ? "active" : ""}`}
                key={conversation._id}
                onClick={() => openConversation(conversation)}
              >
                <strong>
                  {conversation.participants
                    ?.map(
                      (person) =>
                        `${person.name || ""} ${person.surname || ""}`.trim() ||
                        person.username,
                    )
                    .join(" · ") || "Conversazione"}
                </strong>
                <span>
                  {conversation.lastMessage?.text || "Apri la conversazione"}
                </span>
              </button>
            ))
          ) : (
            <p className="empty-state">Le tue conversazioni appariranno qui.</p>
          )}
        </aside>
        <section className="message-panel">
          {selected ? (
            <>
              <header className="chat-header">
                <strong>
                  {selected.participants
                    ?.map(
                      (person) =>
                        `${person.name || ""} ${person.surname || ""}`.trim() ||
                        person.username,
                    )
                    .join(" · ")}
                </strong>
                <span>Conversazione privata</span>
              </header>
              <div className="message-list">
                {messages.map((message) => (
                  <div className="message" key={message._id}>
                    <small className="message-author">
                      {message.senderId?.name ||
                        message.senderId?.username ||
                        "Utente"}{" "}
                      {message.senderId?.surname || ""}
                    </small>
                    <p>{message.text}</p>
                    <small>
                      {new Date(message.createdAt).toLocaleString("it-IT")}
                    </small>
                  </div>
                ))}
              </div>
              <form className="message-form" onSubmit={submit}>
                <input
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  placeholder="Scrivi un messaggio..."
                />
                <button className="button" type="submit">
                  Invia
                </button>
              </form>
            </>
          ) : (
            <div className="empty-state">
              Seleziona una conversazione per iniziare.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
