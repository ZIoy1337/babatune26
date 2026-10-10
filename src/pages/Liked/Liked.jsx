// src/pages/Liked/Liked.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TrackCard from "../../components/Cards/TrackCard";
import { getLikedPlaylist, getPlaylistSongs, removeSongFromPlaylist } from "../../api/playlists";
import { assetUrl } from "../../api/client";
import { useAuth } from "../../store/AuthContext";
import styles from "../Home/Home.module.css";

export default function Liked() {
    const { user, accessToken } = useAuth();
    const [playlistId, setPlaylistId] = useState(null);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) return;
        let alive = true;

        (async () => {
            try {
                const playlist = await getLikedPlaylist(accessToken);
                const page = await getPlaylistSongs(playlist.id, accessToken);
                if (!alive) return;
                setPlaylistId(playlist.id);
                setSongs(
                    page.items.map((song) => ({
                        id: song.id,
                        name: song.name,
                        author: song.author?.name || "Неизвестный исполнитель",
                        image: assetUrl(song.imageUrl),
                    }))
                );
            } catch (e) {
                if (alive) setError(e.message);
            } finally {
                if (alive) setLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, [user, accessToken]);

    async function handleUnlike(songId) {
        try {
            await removeSongFromPlaylist(playlistId, songId, accessToken);
            setSongs((prev) => prev.filter((s) => s.id !== songId));
        } catch (e) {
            setError(e.message);
        }
    }

    if (!user) {
        return (
            <p style={{ color: "white" }}>
                Чтобы увидеть понравившееся, <Link to="/login">войди в аккаунт</Link>.
            </p>
        );
    }
    if (loading) return <p style={{ color: "white" }}>Загрузка...</p>;
    if (error) return <p style={{ color: "white" }}>Ошибка: {error}</p>;

    return (
        <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Liked</h2>

            {songs.length === 0 ? (
                <p style={{ opacity: 0.6, color: "white" }}>Тут пока пусто.</p>
            ) : (
                <div className={styles.tracksRow}>
                    {songs.map((song) => (
                        <TrackCard key={song.id} {...song} liked={true} onToggleLike={() => handleUnlike(song.id)} />
                    ))}
                </div>
            )}
        </section>
    );
}