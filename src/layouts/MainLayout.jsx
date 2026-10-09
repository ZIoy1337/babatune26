import { Outlet } from "react-router-dom";
import styles from "./MainLayout.module.css";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import PlayerBar from "../components/PlayerBar/PlayerBar";

export default function MainLayout() {
    return (
        <div className={styles.layout}>
            <div className={styles.header}><Header /></div>
            <div className={styles.sidebar}><Sidebar /></div>
            <div className={styles.main}><Outlet /></div>
            <div className={styles.player}><PlayerBar /></div>
        </div>
    );
}