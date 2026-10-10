import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
import { getMyPlaylists } from "../../api/playlists";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
    const { user, accessToken } = useAuth();
    const { pathname } = useLocation();
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        if (!user) return;
        let alive = true;
        getMyPlaylists(accessToken)
            .then((d) => alive && setPlaylists(d.items.filter((p) => p.type !== 0))) // 0 = Liked
            .catch(() => { });
        return () => {
            alive = false;
        };
    }, [user, accessToken, pathname]);

    const shown = user ? playlists : [];

    return (
        <aside className={styles.sidebar}>
            <nav>
                <div>MENU</div>
                <Link to="/">Home</Link>
                <Link to="/library">My Library</Link>
                <Link to="/history">History</Link>
                <Link to="/rooms">Listen together</Link>
            </nav>

            <nav>
                <div>PLAYLISTS</div>
                <Link to="/liked">Liked</Link>
                {shown.map((p) => (
                    <Link key={p.id} to={`/playlists/${p.id}`}>
                        {p.name || "Без названия"}
                    </Link>
                ))}
                <Link to="/playlists/new">+ New</Link>
            </nav>
        </aside>
    );
}