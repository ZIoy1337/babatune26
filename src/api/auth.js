import apiFetch from "./client";

export function register({ email, password, name }) {
    return apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, name }),
    });
}

export function login({ email, password }) {
    return apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
}

export function logout(refreshToken) {
    return apiFetch("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
    });
}