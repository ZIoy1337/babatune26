import { useState, useEffect } from "react";
import TrackCard from "../../components/Cards/TrackCard";
import AddToPlaylist from "../../components/AddToPlaylist/AddToPlaylist";
import { getTopSongs } from "../../api/songs";
import { addSongToPlaylist, removeSongFromPlaylist } from "../../api/playlists";
import { assetUrl } from "../../api/client";
import { useAuth } from "../../store/AuthContext";
import { useLikedPlaylistId } from "../../store/useLikedPlaylist";
import styles from "./Home.module.css";

function mapSong(song) {
    return {
        id: song.id,
        name: song.name,
        author: song.author?.name || "Неизвестный исполнитель",
        image: assetUrl(song.imageUrl),
        liked: song.isLiked,
    };
}

export default function Home() {
    const { accessToken } = useAuth();
    const likedPlaylistId = useLikedPlaylistId();
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getTopSongs(accessToken)
            .then((data) => setSongs(data.items.map(mapSong)))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [accessToken]);

    async function handleToggleLike(song) {
        if (!accessToken) return alert("Войди в аккаунт, чтобы лайкать");
        if (!likedPlaylistId) return;
        try {
            if (song.liked) {
                await removeSongFromPlaylist(likedPlaylistId, song.id, accessToken);
            } else {
                await addSongToPlaylist(likedPlaylistId, song.id, accessToken);
            }
            setSongs((prev) => prev.map((s) => (s.id === song.id ? { ...s, liked: !s.liked } : s)));
        } catch (err) {
            alert(err.message);
        }
    }

    if (loading) return <p style={{ color: "white" }}>Загрузка...</p>;
    if (error) return <p style={{ color: "white" }}>Ошибка: {error}</p>;

    return (
        <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Tacks</h2>
            <div className={styles.tracksRow}>
                {songs.map((song) => (
                    <TrackCard
                        key={song.id}
                        {...song}
                        onToggleLike={() => handleToggleLike(song)}
                        menu={<AddToPlaylist songId={song.id} />}
                    />
                ))}
            </div>
        </section>
    );
}