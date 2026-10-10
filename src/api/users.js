import apiFetch from "./client";

export function getMe(token) {
    return apiFetch("/users/me", {}, token);
}
export const updateMe = (name, token) =>
    apiFetch("/users/me", { method: "PUT", body: JSON.stringify({ name }) }, token);

export const updatePassword = (currentPassword, newPassword, token) =>
    apiFetch(
        "/users/me/password",
        { method: "PUT", body: JSON.stringify({ currentPassword, newPassword }) },
        token
    );

// бэкенд ждёт поле формы с именем avatarFile
export function uploadAvatar(file, token) {
    const form = new FormData();
    form.append("avatarFile", file);
    return apiFetch("/users/me/avatar", { method: "PUT", body: form }, token);
}

export const deleteAvatar = (token) =>
    apiFetch("/users/me/avatar", { method: "DELETE" }, token);