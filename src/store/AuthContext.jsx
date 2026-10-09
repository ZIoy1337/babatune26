import { createContext, useContext, useState, useEffect } from "react";
import * as authApi from "../api/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem("auth");
        if (saved) {
            const parsed = JSON.parse(saved);
            setUser(parsed.user);
            setAccessToken(parsed.accessToken);
            setRefreshToken(parsed.refreshToken);
        }
    }, []);

    function saveSession(data) {
        setUser(data.user);
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        localStorage.setItem("auth", JSON.stringify(data));
    }

    async function handleLogin(credentials) {
        setLoading(true);
        setError(null);
        try {
            const data = await authApi.login(credentials);
            saveSession(data);
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
            const data = await authApi.register(payload);
            saveSession(data);
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    }

    async function handleLogout() {
        if (refreshToken) {
            try { await authApi.logout(refreshToken); } catch { /* ignore */ }
        }
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        localStorage.removeItem("auth");
    }

    return (
        <AuthContext.Provider
            value={{ user, accessToken, loading, error, login: handleLogin, register: handleRegister, logout: handleLogout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}