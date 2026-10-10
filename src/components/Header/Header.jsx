// src/components/Header/Header.jsx
import { Link } from "react-router-dom";
import { IoChatbubbleOutline, IoSettingsOutline, IoPersonOutline, IoSearchOutline } from "react-icons/io5";
import { useAuth } from "../../store/AuthContext";
import styles from "./Header.module.css";
import NotificationBell from "../NotificationBell/NotificationBell";

export default function Header() {
    const { user } = useAuth();

    return (
        <header className={styles.header}>
            <Link to="/" className={styles.logo}>BabaTune</Link>

            <div className={styles.search}>
                <IoSearchOutline />
                <input type="text" placeholder="Search" />
            </div>

            <div className={styles.icons}>
                <NotificationBell />

                <Link
                    to={user ? "/rooms" : "/login"}
                    className={styles.profileLink}
                    title="Слушать вместе"
                >
                    <IoChatbubbleOutline />
                </Link>

                <Link to="/settings" className={styles.profileLink} title="Настройки">
                    <IoSettingsOutline />
                </Link>

                <Link
                    to={user ? "/profile" : "/login"}
                    className={styles.profileLink}
                    title={user ? "Профиль" : "Войти"}
                >
                    <IoPersonOutline />
                </Link>
            </div>
        </header>
    );
}