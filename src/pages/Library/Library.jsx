// src/pages/Library/Library.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TrackCard from "../../components/Cards/TrackCard";
import { getMyPlaylists } from "../../api/playlists";
import { assetUrl } from "../../api/client";
import { useAuth } from "../../store/AuthContext";
import styles from "../Home/Home.module.css";

export default function Library() {
    const { user, accessToken } = useAuth();
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) return;
        getMyPlaylists(accessToken)
            .then((d) => setPlaylists(d.items))
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [user, accessToken]);

    if (!user) return <p style={{ color: "white" }}>Войди в аккаунт, чтобы увидеть библиотеку.</p>;
    if (loading) return <p style={{ color: "white" }}>Загрузка...</p>;
    if (error) return <p style={{ color: "white" }}>Ошибка: {error}</p>;

    return (
        <section className={styles.section}>
            <h2 className={styles.sectionTitle}>My Library</h2>
            <div className={styles.tracksRow} style={{ flexWrap: "wrap" }}>
                {playlists.map((p) => (
                    <Link key={p.id} to={p.type === 0 ? "/liked" : `/playlists/${p.id}`}>
                        <TrackCard
                            name={p.type === 0 ? "Понравившиеся" : p.name || "Без названия"}
                            author="Плейлист"
                            image={assetUrl(p.imageUrl)}
                        />
                    </Link>
                ))}
                <Link to="/playlists/new">
                    <TrackCard name="+ Новый плейлист" author="Создать" image="https://placehold.co/140x140?text=%2B" />
                </Link>
            </div>
        </section>
    );
}