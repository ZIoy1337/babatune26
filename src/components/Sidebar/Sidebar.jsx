import { Link } from "react-router-dom";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
    return (
        <aside className={styles.sidebar}>
            <nav>
                <div>MENU</div>
                <Link to="/">Home</Link>
                <Link to="/library">My Library</Link>
                <Link to="/history">History</Link>
            </nav>

            <nav>
                <div>PLAYLISTS</div>
                <Link to="/liked">Liked</Link>
                <Link to="/playlist-1">Playlist-I</Link>
                <Link to="/new">+ New</Link>
            </nav>
        </aside>
    );
}