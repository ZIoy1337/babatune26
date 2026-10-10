console.log("Hello World!")// src/api/history.js
import apiFetch from "./client";

export const getHistory = (token, pageSize = 50) =>
    apiFetch(`/listen-history?pageNumber=1&pageSize=${pageSize}`, {}, token);

// playedPercent: от 0 до 100
export const recordListen = (songId, playedPercent, token) =>
    apiFetch("/listen-history", { method: "POST", body: JSON.stringify({ songId, playedPercent }) }, token);