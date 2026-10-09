// pages/Settings/Settings.jsx
import { useState } from "react";
import styles from "./Settings.module.css";

export default function Settings() {
    const [settings, setSettings] = useState({
        name: "МузикаВітч",
        email: "example@mail.com",
        notifyNewFollowers: true,
        notifyNewMusic: false,
        privateProfile: false,
    });

    function handleChange(field, value) {
        setSettings((prev) => ({ ...prev, [field]: value }));
    }

    function handleSave() {
        // пока просто выводим в консоль — тут появится реальный запрос к API
        console.log("Сохранённые настройки:", settings);
        alert("Настройки сохранены (пока только локально)");
    }

    return (
        <div className={styles.page}>
            <h2 className={styles.title}>Settings</h2>

            <section className={styles.card}>
                <h3>Профиль</h3>

                <label className={styles.field}>
                    <span>Имя</span>
                    <input
                        type="text"
                        value={settings.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                    />
                </label>

                <label className={styles.field}>
                    <span>Email</span>
                    <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                    />
                </label>
            </section>

            <section className={styles.card}>
                <h3>Уведомления</h3>

                <label className={styles.toggleRow}>
                    <span>Новые подписчики</span>
                    <input
                        type="checkbox"
                        checked={settings.notifyNewFollowers}
                        onChange={(e) => handleChange("notifyNewFollowers", e.target.checked)}
                    />
                </label>

                <label className={styles.toggleRow}>
                    <span>Новая музыка от исполнителей</span>
                    <input
                        type="checkbox"
                        checked={settings.notifyNewMusic}
                        onChange={(e) => handleChange("notifyNewMusic", e.target.checked)}
                    />
                </label>
            </section>

            <section className={styles.card}>
                <h3>Приватность</h3>

                <label className={styles.toggleRow}>
                    <span>Приватный профиль</span>
                    <input
                        type="checkbox"
                        checked={settings.privateProfile}
                        onChange={(e) => handleChange("privateProfile", e.target.checked)}
                    />
                </label>
            </section>

            <button className={styles.saveBtn} onClick={handleSave}>
                Сохранить
            </button>
        </div>
    );
}