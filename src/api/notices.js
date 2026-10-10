// src/api/notices.js
import apiFetch from "./client";

export const getUnreadCount = (token) => apiFetch("/notices/unread-count", {}, token);

export const getNotices = (token, pageSize = 20) =>
    apiFetch(`/notices?pageNumber=1&pageSize=${pageSize}`, {}, token);

export const markNoticeRead = (id, token) =>
    apiFetch(`/notices/${id}/read`, { method: "POST" }, token);