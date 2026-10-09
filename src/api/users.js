import apiFetch from "./client";

export function getMe(token) {
    return apiFetch("/users/me", {}, token);
}