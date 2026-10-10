// src/pages/History/History.jsx
import { useState, useEffect } from "react";
import TrackListItem from "../../components/TrackListItem/TrackListItem";
import { getHistory } from "../../api/history";
import { useAuth } from "../../store/AuthContext";
import styles from "../Home/Home.module.css";

export default function History() {
    const { user, accessToken } = useAuth();
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) return;
        getHistory(accessToken)
            .then((d) => setSongs(d.items))
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [user, accessToken]);

    if (!user) return <p style={{ color: "white" }}>Войди в аккаунт, чтобы увидеть историю.</p>;
    if (loading) return <p style={{ color: "white" }}>Загрузка...</p>;
    if (error) return <p style={{ color: "white" }}>Ошибка: {error}</p>;

    return (
        <section className={styles.section}>
            <h2 className={styles.sectionTitle}>History</h2>
            {songs.length === 0 && <p style={{ opacity: 0.6, color: "white" }}>Пока ничего не слушал.</p>}
            {songs.map((s, i) => (
                <TrackListItem
                    key={`${s.id}-${i}`}
                    number={i + 1}
                    name={s.name}
                    author={s.author?.name ?? ""}
                    date=""
                    duration=""
                />
            ))}
        </section>
    );
}