import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
import styles from "./Auth.module.css";

export default function Login() {
    const { login, loading, error } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });

    async function handleSubmit(e) {
        e.preventDefault();
        const success = await login(form);
        if (success) navigate("/");
    }

    return (
        <div className={styles.wrap}>
            <form className={styles.card} onSubmit={handleSubmit}>
                <h2>Вход</h2>

                {error && <p className={styles.error}>{error}</p>}

                <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Входим..." : "Войти"}
                </button>

                <p className={styles.switch}>
                    Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
                </p>
            </form>
        </div>
    );
}