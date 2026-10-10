// src/components/NotificationBell/NotificationBell.jsx
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { IoNotificationsOutline } from "react-icons/io5";
import { useAuth } from "../../store/AuthContext";
import { getUnreadCount, getNotices, markNoticeRead } from "../../api/notices";
import { assetUrl } from "../../api/client";
import { parseUtc } from "../../utils/time";
import styles from "./NotificationBell.module.css";

const POLL_MS = 15000;

export default function NotificationBell() {
    const { user, accessToken } = useAuth();
    const navigate = useNavigate();
    const boxRef = useRef(null);
    const dropRef = useRef(null);
    const [pos, setPos] = useState({ top: 0, right: 0 });
    const [count, setCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);

    // счётчик непрочитанных обновляется раз в 15 секунд
    useEffect(() => {
        if (!user) return;
        let alive = true;
        const load = () =>
            getUnreadCount(accessToken)
                .then((d) => alive && setCount(d.count))
                .catch(() => { });
        load();
        const id = setInterval(load, POLL_MS);
        return () => {
            alive = false;
            clearInterval(id);
        };
    }, [user, accessToken]);

    // клик мимо закрывает список
    useEffect(() => {
        if (!open) return;
        const onDown = (e) => {
            const inBell = boxRef.current?.contains(e.target);
            const inDrop = dropRef.current?.contains(e.target);
            if (!inBell && !inDrop) setOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, [open]);

    if (!user) {
        return (
            <Link to="/login" className={styles.button} title="Войти">
                <IoNotificationsOutline />
            </Link>
        );
    }

    function toggle() {
        const next = !open;
        if (next && boxRef.current) {
            const r = boxRef.current.getBoundingClientRect();
            setPos({ top: r.bottom + 8, right: window.innerWidth - r.right });
        }
        setOpen(next);
        if (next) {
            setError(null);
            getNotices(accessToken)
                .then((d) => setItems(d.items))
                .catch((e) => setError(e.message));
        }
    }

    function handleClick(n) {
        if (!n.isRead) {
            setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)));
            setCount((c) => Math.max(0, c - 1));
            markNoticeRead(n.id, accessToken).catch(() => { });
        }
        // переходим только по внутренним ссылкам приложения
        if (n.url?.startsWith("/")) {
            setOpen(false);
            navigate(n.url);
        }
    }

    return (
        <div className={styles.wrap} ref={boxRef}>
            <button className={styles.button} onClick={toggle} title="Уведомления">
                <IoNotificationsOutline />
                {count > 0 && <span className={styles.badge}>{count > 99 ? "99+" : count}</span>}
            </button>

            {open && createPortal(
                <div
                    ref={dropRef}
                    className={styles.dropdown}
                    style={{ position: "fixed", top: pos.top, right: pos.right, zIndex: 10000 }}
                >
                    <div className={styles.head}>Уведомления</div>
                    {error && <div className={styles.empty}>{error}</div>}
                    {!error && items.length === 0 && <div className={styles.empty}>Пока ничего нет</div>}

                    {items.map((n) => (
                        <div
                            key={n.id}
                            className={`${styles.item} ${n.isRead ? "" : styles.unread}`}
                            onClick={() => handleClick(n)}
                        >
                            {n.imageUrl && <img src={assetUrl(n.imageUrl, null)} alt="" />}
                            <div className={styles.body}>
                                <div className={styles.title}>{n.title}</div>
                                {n.text && <div className={styles.text}>{n.text}</div>}
                                <div className={styles.time}>
                                    {new Date(parseUtc(n.createdAt)).toLocaleString("ru-RU", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>,
                document.body
            )}
        </div>
    );
}