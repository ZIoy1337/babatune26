import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
import styles from "./Auth.module.css";

export default function Register() {
    const { register, loading, error } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "" });

    async function handleSubmit(e) {
        e.preventDefault();
        const success = await register(form);
        if (success) navigate("/");
    }

    return (
        <div className={styles.wrap}>
            <form className={styles.card} onSubmit={handleSubmit}>
                <h2>Регистрация</h2>

                {error && <p className={styles.error}>{error}</p>}

                <input
                    type="text"
                    placeholder="Имя"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                />
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
                    {loading ? "Создаём..." : "Зарегистрироваться"}
                </button>

                <p className={styles.switch}>
                    Уже есть аккаунт? <Link to="/login">Войти</Link>
                </p>
            </form>
        </div>
    );
}