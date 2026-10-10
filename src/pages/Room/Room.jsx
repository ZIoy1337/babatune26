// src/pages/Room/Room.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
import { getRoom, joinRoom, leaveRoom, updatePlayback, skipRoom, addSongToQueue } from "../../api/rooms";
import { getMessages, sendText } from "../../api/chats";
import { getTopSongs } from "../../api/songs";
import { assetUrl } from "../../api/client";
import styles from "./Room.module.css";
import { recordListen } from "../../api/history";

const POLL_MS = 2000;

// сервер отдаёт UTC; если суффикса Z нет, браузер прочитает время как местное
function parseUtc(s) {
    return new Date(/[zZ]|[+-]\d\d:\d\d$/.test(s) ? s : s + "Z").getTime();
}

function expectedPositionMs(room) {
    if (!room.isPlaying) return room.playbackPositionMs;
    return room.playbackPositionMs + (Date.now() - parseUtc(room.updatedAt));
}

function fmt(sec) {
    const s = Math.max(0, Math.floor(sec || 0));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export default function Room() {
    const { roomId } = useParams();
    const { accessToken, user } = useAuth();
    const navigate = useNavigate();
    const audioRef = useRef(null);
    const chatRef = useRef(null);

    const [room, setRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [error, setError] = useState(null);
    const [started, setStarted] = useState(false); // браузер не даёт играть звук без клика
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [tracks, setTracks] = useState([]);

    const isOwner = room?.owner?.id === user?.id;
    const song = room?.currentSong;

    // зайти в комнату один раз
    useEffect(() => {
        joinRoom(roomId, accessToken).catch((e) => console.warn("join:", e.message));
    }, [roomId, accessToken]);

    // опрос состояния комнаты и чата
    const refresh = useCallback(async () => {
        try {
            const r = await getRoom(roomId, accessToken);
            setRoom(r);
            const page = await getMessages(r.chatId, accessToken);
            setMessages([...page.items].reverse()); // сервер отдаёт от новых к старым
            setError(null);
        } catch (e) {
            setError(e.message);
        }
    }, [roomId, accessToken]);


    useEffect(() => {
        const first = setTimeout(refresh, 0);
        const id = setInterval(refresh, POLL_MS);
        return () => {
            clearTimeout(first);
            clearInterval(id);
        };
    }, [refresh]);

    const handleEnded = () => {
        if (song) recordListen(song.id, 100, accessToken).catch(() => { });
        if (isOwner) run(() => skipRoom(roomId, accessToken));
    };


    // подгоняем звук под состояние комнаты
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !room || !song || !started) return;
        const target = expectedPositionMs(room) / 1000;
        if (Math.abs(audio.currentTime - target) > 2) audio.currentTime = target;
        if (room.isPlaying && audio.paused) audio.play().catch(() => { });
        if (!room.isPlaying && !audio.paused) audio.pause();
    }, [room, song, started]);

    // список треков, чтобы владелец мог добавлять в очередь
    useEffect(() => {
        if (!isOwner) return;
        getTopSongs(accessToken).then((d) => setTracks(d.items)).catch(() => { });
    }, [isOwner, accessToken]);

    // чат прокручивается вниз при новых сообщениях
    useEffect(() => {
        if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, [messages.length]);

    async function run(action) {
        try {
            await action();
            refresh();
        } catch (e) {
            setError(e.message);
        }
    }

    const togglePlay = () =>
        run(() =>
            updatePlayback(
                roomId,
                { isPlaying: !room.isPlaying, positionMs: Math.round(audioRef.current.currentTime * 1000) },
                accessToken
            )
        );

    const commitSeek = () =>
        run(() =>
            updatePlayback(
                roomId,
                { isPlaying: room.isPlaying, positionMs: Math.round(audioRef.current.currentTime * 1000) },
                accessToken
            )
        );


    async function handleLeave() {
        await leaveRoom(roomId, accessToken).catch(() => { });
        navigate("/rooms");
    }

    async function handleSend(e) {
        e.preventDefault();
        const value = text.trim();
        if (!value) return;
        setText("");
        run(() => sendText(room.chatId, value, accessToken));
    }

    if (error && !room) return <p className={styles.msg}>Ошибка: {error}</p>;
    if (!room) return <p className={styles.msg}>Загрузка...</p>;

    return (
        <div className={styles.page}>
            <audio
                ref={audioRef}
                src={song?.url}
                onTimeUpdate={(e) => setProgress(e.target.currentTime)}
                onLoadedMetadata={(e) => setDuration(e.target.duration)}
                onEnded={handleEnded}
            />

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.left}>
                <div className={styles.header}>
                    <h2>Комната {room.owner?.name}</h2>
                    <div>
                        <button onClick={() => navigator.clipboard.writeText(window.location.href)}>Копировать ссылку</button>
                        <button onClick={handleLeave}>Выйти</button>
                    </div>
                </div>

                <div className={styles.player}>
                    <img src={assetUrl(song?.imageUrl, "https://placehold.co/160x160")} alt="" />
                    <div className={styles.info}>
                        <div className={styles.title}>{song?.name ?? "Ничего не играет"}</div>
                        <div className={styles.muted}>{song?.author?.name}</div>

                        {!started ? (
                            <button className={styles.primary} onClick={() => setStarted(true)}>
                                Слушать вместе
                            </button>
                        ) : (
                            <>
                                <input
                                    type="range"
                                    min={0}
                                    max={duration || 0}
                                    step={0.5}
                                    value={progress}
                                    disabled={!isOwner}
                                    onChange={(e) => {
                                        audioRef.current.currentTime = Number(e.target.value);
                                        setProgress(Number(e.target.value));
                                    }}
                                    onPointerUp={commitSeek}
                                />
                                <div className={styles.muted}>
                                    {fmt(progress)} / {fmt(duration)}
                                </div>
                                {isOwner ? (
                                    <div>
                                        <button className={styles.primary} onClick={togglePlay}>
                                            {room.isPlaying ? "Пауза" : "Играть"}
                                        </button>
                                        <button onClick={() => run(() => skipRoom(roomId, accessToken))}>Дальше</button>
                                    </div>
                                ) : (
                                    <div className={styles.muted}>Музыкой управляет {room.owner?.name}</div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <h3>Очередь</h3>
                {room.queue.length === 0 && <p className={styles.muted}>Пусто.</p>}
                <ul className={styles.list}>
                    {room.queue.map((q) => (
                        <li key={q.id}>{q.song.name} — {q.song.author?.name}</li>
                    ))}
                </ul>

                {isOwner && (
                    <>
                        <h3>Добавить трек</h3>
                        <ul className={styles.list}>
                            {tracks.map((t) => (
                                <li key={t.id}>
                                    {t.name} — {t.author?.name}
                                    <button onClick={() => run(() => addSongToQueue(roomId, t.id, accessToken))}>+</button>
                                </li>
                            ))}
                        </ul>
                    </>
                )}

                <h3>Слушают ({room.members.length})</h3>
                <div className={styles.muted}>{room.members.map((m) => m.name).join(", ")}</div>
            </div>

            <div className={styles.chat}>
                <h3>Чат</h3>
                <div className={styles.messages} ref={chatRef}>
                    {messages.map((m) => (
                        <div key={m.id} className={styles.message}>
                            <b>{m.user?.name}</b>{" "}
                            {m.type === 1 ? <i>скинул трек: {m.song?.name}</i> : m.text}
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSend} className={styles.form}>
                    <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Сообщение..." />
                    <button type="submit">→</button>
                </form>
            </div>
        </div>
    );
}