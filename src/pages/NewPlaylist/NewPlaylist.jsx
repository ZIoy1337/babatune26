// src/pages/NewPlaylist/NewPlaylist.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPlaylist } from "../../api/playlists";
import { useAuth } from "../../store/AuthContext";
import styles from "../Settings/Settings.module.css";

const MAX_IMAGE = 5 * 1024 * 1024;

export default function NewPlaylist() {
    const { user, accessToken } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [busy, setBusy] = useState(false);

    if (!user) {
        return (
            <div className={styles.page}>
                <p>Чтобы создать плейлист, <Link to="/login">войди в аккаунт</Link>.</p>
            </div>
        );
    }

    function onFile(e) {
        const f = e.target.files[0];
        if (!f) return setFile(null);
        if (!f.type.startsWith("image/")) return setError("Нужна картинка");
        if (f.size > MAX_IMAGE) return setError("Файл больше 5 МБ");
        setError(null);
        setFile(f);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!name.trim()) return setError("Введи название");
        setBusy(true);
        setError(null);
        try {
            await createPlaylist(name.trim(), file, accessToken);
            navigate("/library");
        } catch (err) {
            setError(err.message);
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className={styles.page}>
            <h2 className={styles.title}>Новый плейлист</h2>
            <form className={styles.card} onSubmit={handleSubmit}>
                <label className={styles.field}>
                    <span>Название</span>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <label className={styles.field}>
                    <span>Обложка (необязательно)</span>
                    <input type="file" accept="image/*" onChange={onFile} />
                </label>
                <button className={styles.saveBtn} disabled={busy}>
                    {busy ? "Создаём..." : "Создать"}
                </button>
                {error && <p className={styles.err}>{error}</p>}
            </form>
        </div>
    );
}