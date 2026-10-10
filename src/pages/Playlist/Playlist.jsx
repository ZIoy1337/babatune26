// src/pages/Playlist/Playlist.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlaylist, getPlaylistSongs, removeSongFromPlaylist, deletePlaylist } from "../../api/playlists";
import { assetUrl } from "../../api/client";
import { useAuth } from "../../store/AuthContext";
import styles from "./Playlist.module.css";

export default function Playlist() {
    const { id } = useParams();
    const { user, accessToken } = useAuth();
    const navigate = useNavigate();
    const [playlist, setPlaylist] = useState(null);
    const [songs, setSongs] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        let alive = true;
        Promise.all([getPlaylist(id, accessToken), getPlaylistSongs(id, accessToken)])
            .then(([p, s]) => {
                if (!alive) return;
                setPlaylist(p);
                setSongs(s.items);
            })
            .catch((e) => alive && setError(e.message));
        return () => {
            alive = false;
        };
    }, [id, accessToken]);

    async function handleRemove(songId) {
        try {
            await removeSongFromPlaylist(id, songId, accessToken);
            setSongs((prev) => prev.filter((s) => s.id !== songId));
        } catch (e) {
            setError(e.message);
        }
    }

    async function handleDelete() {
        if (!window.confirm("Удалить плейлист?")) return;
        try {
            await deletePlaylist(id, accessToken);
            navigate("/library");
        } catch (e) {
            setError(e.message);
        }
    }

    if (error && !playlist) return <p style={{ color: "white" }}>Ошибка: {error}</p>;
    if (!playlist) return <p style={{ color: "white" }}>Загрузка...</p>;

    const isOwner = playlist.userId === user?.id;
    const canDelete = isOwner && playlist.type === 1; // 1 = Custom

    return (
        <div className={styles.page}>
            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.head}>
                <img src={assetUrl(playlist.imageUrl, "https://placehold.co/120x120")} alt="" />
                <div>
                    <h2>{playlist.name || "Без названия"}</h2>
                    <div className={styles.muted}>
                        {playlist.songsCount} треков · {playlist.userName}
                    </div>
                    {canDelete && (
                        <button className={styles.btn} onClick={handleDelete}>
                            Удалить плейлист
                        </button>
                    )}
                </div>
            </div>

            {songs.length === 0 && <p className={styles.muted}>Пока пусто. Добавь треки кнопкой «+» на карточках на главной.</p>}

            {songs.map((s) => (
                <div key={s.id} className={styles.row}>
                    <img src={assetUrl(s.imageUrl, "https://placehold.co/44x44")} alt="" />
                    <div className={styles.info}>
                        <div className={styles.name}>{s.name}</div>
                        <div className={styles.muted}>{s.author?.name}</div>
                    </div>
                    {isOwner && (
                        <button className={styles.btn} onClick={() => handleRemove(s.id)}>
                            Убрать
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}