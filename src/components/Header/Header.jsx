import { Link } from "react-router-dom";
import { IoNotificationsOutline, IoChatbubbleOutline, IoSettingsOutline, IoPersonOutline, IoSearchOutline } from "react-icons/io5";
import styles from "./Header.module.css";

export default function Header() {
    return (
        <header className={styles.header}>
            <Link to="/" className={styles.logo}>BabaTune</Link>

            <div className={styles.search}>
                <IoSearchOutline />
                <input type="text" placeholder="Search" />
            </div>

            <div className={styles.icons}>
                <IoNotificationsOutline />
                <IoChatbubbleOutline />
                <Link to="/settings" className={styles.profileLink}>
                    <IoSettingsOutline />
                </Link>
                <Link to="/profile" className={styles.profileLink}>
                    <IoPersonOutline />
                </Link>
            </div>
        </header>
    );
}