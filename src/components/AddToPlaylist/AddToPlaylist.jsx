// src/components/AddToPlaylist/AddToPlaylist.jsx
import { useState } from "react";
import { createPortal } from "react-dom";
import { IoAdd } from "react-icons/io5";
import { useAuth } from "../../store/AuthContext";
import { getMyPlaylists, addSongToPlaylist } from "../../api/playlists";
import styles from "./AddToPlaylist.module.css";

export default function AddToPlaylist({ songId }) {
    const { user, accessToken } = useAuth();
    const [open, setOpen] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [status, setStatus] = useState(null);

    if (!user) return null;

    function openModal() {
        setOpen(true);
        setStatus(null);
        getMyPlaylists(accessToken)
            .then((d) => setPlaylists(d.items.filter((p) => p.type !== 0)))
            .catch((e) => setStatus({ ok: false, text: e.message }));
    }

    async function add(p) {
        try {
            await addSongToPlaylist(p.id, songId, accessToken);
            setStatus({ ok: true, text: `Добавлено в «${p.name}»` });
        } catch (e) {
            setStatus({ ok: false, text: e.message });
        }
    }

    return (
        <>
            <button className={styles.btn} onClick={openModal} title="Добавить в плейлист">
                <IoAdd />
            </button>

            {open &&
                createPortal(
                    <div className={styles.overlay} onClick={() => setOpen(false)}>
                        <div className={styles.box} onClick={(e) => e.stopPropagation()}>
                            <h3>Добавить в плейлист</h3>

                            {playlists.length === 0 && (
                                <p className={styles.muted}>Плейлистов пока нет. Создай через «+ New» в меню слева.</p>
                            )}

                            <ul className={styles.list}>
                                {playlists.map((p) => (
                                    <li key={p.id}>
                                        <button onClick={() => add(p)}>{p.name || "Без названия"}</button>
                                    </li>
                                ))}
                            </ul>

                            {status && <p className={status.ok ? styles.ok : styles.err}>{status.text}</p>}
                            <button className={styles.close} onClick={() => setOpen(false)}>
                                Закрыть
                            </button>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
}