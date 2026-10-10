// src/api/client.js
import { getSession, setSession } from "./session";
import { parseUtc } from "../utils/time";

export const API_BASE_URL = "https://localhost:7153/api";
export const ASSET_BASE_URL = "https://localhost:7153";

export function assetUrl(path, fallback = "https://placehold.co/140x140") {
    if (!path) return fallback;
    return path.startsWith("http") ? path : `${ASSET_BASE_URL}${path}`;
}

const TIMEOUT_MS = 15000;

// обычный fetch, который сдаётся через 15 секунд и говорит понятным языком
async function fetchWithTimeout(url, init) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
        return await fetch(url, { ...init, signal: controller.signal });
    } catch (e) {
        if (e.name === "AbortError") {
            throw new Error("Сервер не отвечает. Проверь, что бэкенд запущен.");
        }
        if (e instanceof TypeError) {
            throw new Error("Нет связи с сервером. Проверь, что бэкенд запущен и адрес в client.js верный.");
        }
        throw e;
    } finally {
        clearTimeout(timer);
    }
}

let refreshPromise = null;

// один общий запрос на обновление: refresh-токен одноразовый
function refreshSession() {
    if (!refreshPromise) {
        refreshPromise = doRefresh().finally(() => {
            refreshPromise = null;
        });
    }
    return refreshPromise;
}

async function doRefresh() {
    const session = getSession();
    if (!session?.refreshToken) {
        setSession(null);
        throw new Error("Сессия истекла, войдите заново");
    }

    const res = await fetchWithTimeout(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: session.refreshToken }),
    });

    if (!res.ok) {
        if (res.status < 500) setSession(null); // токен недействителен
        throw new Error("Сессия истекла, войдите заново");
    }

    const data = await res.json();
    setSession(data);
    return data;
}

function isExpiringSoon(session) {
    return session?.expiresAt && parseUtc(session.expiresAt) - Date.now() < 30_000;
}

// Параметр token работает как флаг «запрос от залогиненного».
// Реальный токен берётся из сессии, поэтому он всегда свежий.
export default async function apiFetch(endpoint, options = {}, token = null) {
    const authed = Boolean(token);

    if (authed && isExpiringSoon(getSession())) {
        await refreshSession().catch(() => { });
    }

    const send = () => {
        const isForm = options.body instanceof FormData;
        const headers = {
            ...(isForm ? {} : { "Content-Type": "application/json" }),
            ...options.headers,
        };
        const current = authed ? getSession()?.accessToken : null;
        if (current) headers.Authorization = `Bearer ${current}`;
        return fetchWithTimeout(`${API_BASE_URL}${endpoint}`, { ...options, headers });
    };

    let res = await send();

    if (res.status === 401 && authed) {
        await refreshSession();
        res = await send();
    }

    if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.detail || errorData?.title || `Ошибка ${res.status}`);
    }

    const text = await res.text();
    return text ? JSON.parse(text) : null;
}