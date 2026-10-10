// src/api/playlists.js
import apiFetch from "./client";

export function getLikedPlaylist(token) {
    return apiFetch("/playlists/liked", {}, token);
}

export function getPlaylistSongs(id, token, { pageNumber = 1, pageSize = 50 } = {}) {
    return apiFetch(`/playlists/${id}/songs?pageNumber=${pageNumber}&pageSize=${pageSize}`, {}, token);
}

export function addSongToPlaylist(playlistId, songId, token) {
    return apiFetch(`/playlists/${playlistId}/songs/${songId}`, { method: "POST" }, token);
}

export function removeSongFromPlaylist(playlistId, songId, token) {
    return apiFetch(`/playlists/${playlistId}/songs/${songId}`, { method: "DELETE" }, token);
}

export const getMyPlaylists = (token, pageSize = 50) =>
    apiFetch(`/playlists/my?pageNumber=1&pageSize=${pageSize}`, {}, token);

export const getPlaylist = (id, token) => apiFetch(`/playlists/${id}`, {}, token);

// бэкенд ждёт multipart: поля Name и ImageFile
export function createPlaylist(name, imageFile, token) {
    const form = new FormData();
    form.append("Name", name);
    if (imageFile) form.append("ImageFile", imageFile);
    return apiFetch("/playlists", { method: "POST", body: form }, token);
}

export const deletePlaylist = (id, token) =>
    apiFetch(`/playlists/${id}`, { method: "DELETE" }, token);