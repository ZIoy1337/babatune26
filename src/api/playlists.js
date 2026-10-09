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