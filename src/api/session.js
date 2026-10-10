// src/api/session.js
const KEY = "auth";
const listeners = new Set();

export function getSession() {
    try {
        return JSON.parse(localStorage.getItem(KEY));
    } catch {
        return null;
    }
}

export function setSession(data) {
    if (data) localStorage.setItem(KEY, JSON.stringify(data));
    else localStorage.removeItem(KEY);
    listeners.forEach((fn) => fn(data ?? null));
}

export function subscribeSession(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
}