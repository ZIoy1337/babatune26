// src/store/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import * as authApi from "../api/auth";
import { getSession, setSession, subscribeSession } from "../api/session";
import { getMe } from "../api/users";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [session, setSessionState] = useState(() => getSession());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // сессия может измениться вне React (например, после обновления токена)
    useEffect(() => subscribeSession(setSessionState), []);

    async function handleLogin(credentials) {
        setLoading(true);
        setError(null);
        try {
            setSession(await authApi.login(credentials));
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    }

    async function handleRegister(payload) {
        setLoading(true);
        setError(null);
        try {
            setSession(await authApi.register(payload));
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    }

    async function refreshUser() {
        const me = await getMe(session?.accessToken);
        const current = getSession();
        if (current) setSession({ ...current, user: me });
    }

    async function handleLogout() {
        const refreshToken = session?.refreshToken;
        if (refreshToken) {
            try { await authApi.logout(refreshToken); } catch { /* ignore */ }
        }
        setSession(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user: session?.user ?? null,
                accessToken: session?.accessToken ?? null,
                loading,
                error,
                login: handleLogin,
                register: handleRegister,
                logout: handleLogout,
                refreshUser,

            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext);
}