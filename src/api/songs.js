import apiFetch from "./client";

export function getTopSongs(token, { period = "Week", pageNumber = 1, pageSize = 20 } = {}) {
    return apiFetch(`/songs/top?period=${period}&pageNumber=${pageNumber}&pageSize=${pageSize}`, {}, token);
}