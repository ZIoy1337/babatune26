export const API_BASE_URL = "https://localhost:7153/api";
export const ASSET_BASE_URL = "https://localhost:7153"; // для картинок, без /api

export default async function apiFetch(endpoint, options = {}, token = null) {
    const headers = { "Content-Type": "application/json", ...options.headers };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

    if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.detail || errorData?.title || `Ошибка ${res.status}`);
    }

    return res.status === 204 ? null : res.json();
}