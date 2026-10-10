// src/api/chats.js
import apiFetch from "./client";

export const getMessages = (chatId, token, pageSize = 50) =>
    apiFetch(`/chats/${chatId}/messages?pageNumber=1&pageSize=${pageSize}`, {}, token);

export const sendText = (chatId, text, token) =>
    apiFetch(`/chats/${chatId}/messages/text`, { method: "POST", body: JSON.stringify({ text }) }, token);