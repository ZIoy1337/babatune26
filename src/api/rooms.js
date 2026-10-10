// src/api/rooms.js
import apiFetch from "./client";

export const getPublicRooms = (token) => apiFetch("/rooms?pageNumber=1&pageSize=20", {}, token);
export const getRoom = (id, token) => apiFetch(`/rooms/${id}`, {}, token);
export const getRoomByOwner = (userId, token) => apiFetch(`/rooms/owner/${userId}`, {}, token);

// type: 0 = Public, 1 = Private (бэкенд принимает enum числом)
export const createRoom = (type, token) =>
    apiFetch("/rooms", { method: "POST", body: JSON.stringify({ type }) }, token);

export const joinRoom = (id, token) => apiFetch(`/rooms/${id}/join`, { method: "POST" }, token);
export const leaveRoom = (id, token) => apiFetch(`/rooms/${id}/leave`, { method: "POST" }, token);
export const skipRoom = (id, token) => apiFetch(`/rooms/${id}/skip`, { method: "POST" }, token);

export const updatePlayback = (id, { isPlaying, positionMs }, token) =>
    apiFetch(`/rooms/${id}/playback`, { method: "PUT", body: JSON.stringify({ isPlaying, positionMs }) }, token);

export const addSongToQueue = (id, songId, token) =>
    apiFetch(`/rooms/${id}/queue/songs/${songId}`, { method: "POST" }, token);