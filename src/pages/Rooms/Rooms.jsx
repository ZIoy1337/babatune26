// src/pages/Rooms/Rooms.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
import { getPublicRooms, getRoomByOwner, createRoom } from "../../api/rooms";
import { assetUrl } from "../../api/client";
import styles from "./Rooms.module.css";

export default function Rooms() {
    const { accessToken, user } = useAuth();
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [myRoom, setMyRoom] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        getPublicRooms(accessToken).then((d) => setRooms(d.items)).catch((e) => setError(e.message));
        if (user?.id) {
            getRoomByOwner(user.id, accessToken).then(setMyRoom).catch(() => setMyRoom(null));
        }
    }, [accessToken, user?.id]);

    async function handleCreate(type) {
        try {
            const room = await createRoom(type, accessToken);
            navigate(`/rooms/${room.id}`);
        } catch (e) {
            setError(e.message);
        }
    }

    return (
        <div className={styles.page}>
            <h2>Слушать вместе</h2>
            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.actions}>
                {myRoom ? (
                    <button onClick={() => navigate(`/rooms/${myRoom.id}`)}>Моя комната</button>
                ) : (
                    <>
                        <button onClick={() => handleCreate(0)}>Создать открытую</button>
                        <button onClick={() => handleCreate(1)}>Создать закрытую</button>
                    </>
                )}
            </div>

            <h3>Открытые комнаты</h3>
            {rooms.length === 0 && <p className={styles.muted}>Пока никого нет.</p>}
            <div className={styles.list}>
                {rooms.map((r) => (
                    <div key={r.id} className={styles.card} onClick={() => navigate(`/rooms/${r.id}`)}>
                        <img src={assetUrl(r.currentSong?.imageUrl, "https://placehold.co/60x60")} alt="" />
                        <div>
                            <div className={styles.title}>{r.currentSong?.name ?? "Ничего не играет"}</div>
                            <div className={styles.muted}>Хозяин: {r.owner?.name}</div>
                        </div>
                        {r.isPlaying && <span className={styles.live}>● играет</span>}
                    </div>
                ))}
            </div>
        </div>
    );
}