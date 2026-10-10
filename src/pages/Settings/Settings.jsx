import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
import { updateMe, updatePassword, uploadAvatar, deleteAvatar } from "../../api/users";
import { assetUrl } from "../../api/client";
import styles from "./Settings.module.css";

const MAX_AVATAR = 5 * 1024 * 1024; // лимит бэкенда

export default function Settings() {
    const { user, accessToken, refreshUser, logout } = useAuth();
    const navigate = useNavigate();
    const fileRef = useRef(null);

    const [name, setName] = useState(user?.name ?? "");
    const [passwords, setPasswords] = useState({ current: "", next: "", repeat: "" });
    const [msg, setMsg] = useState({}); // { profile | avatar | password: { ok, text } }
    const [busy, setBusy] = useState(false);

    if (!user) {
        return (
            <div className={styles.page}>
                <h2 className={styles.title}>Settings</h2>
                <p>Чтобы менять настройки, <Link to="/login">войди в аккаунт</Link>.</p>
            </div>
        );
    }

    function show(section, ok, text) {
        setMsg((m) => ({ ...m, [section]: { ok, text } }));
    }

    async function run(section, action, okText, { refresh = true } = {}) {
        setBusy(true);
        setMsg((m) => ({ ...m, [section]: null }));
        try {
            await action();
            if (refresh) await refreshUser();
            show(section, true, okText);
            return true;
        } catch (e) {
            show(section, false, e.message);
            return false;
        } finally {
            setBusy(false);
        }
    }

    function saveName(e) {
        e.preventDefault();
        const value = name.trim();
        if (!value) return show("profile", false, "Имя не может быть пустым");
        run("profile", () => updateMe(value, accessToken), "Имя сохранено");
    }

    function onFile(e) {
        const file = e.target.files[0];
        e.target.value = ""; // чтобы можно было выбрать тот же файл ещё раз
        if (!file) return;
        if (!file.type.startsWith("image/")) return show("avatar", false, "Нужна картинка");
        if (file.size > MAX_AVATAR) return show("avatar", false, "Файл больше 5 МБ");
        run("avatar", () => uploadAvatar(file, accessToken), "Аватар обновлён");
    }

    async function savePassword(e) {
        e.preventDefault();
        const { current, next, repeat } = passwords;
        if (!current || !next) return show("password", false, "Заполни оба поля");
        if (next !== repeat) return show("password", false, "Новые пароли не совпадают");

        const ok = await run(
            "password",
            () => updatePassword(current, next, accessToken),
            "Пароль изменён",
            { refresh: false }
        );
        if (ok) setPasswords({ current: "", next: "", repeat: "" });
    }

    async function handleLogout() {
        await logout();
        navigate("/login");
    }

    const note = (m) => m && <p className={m.ok ? styles.ok : styles.err}>{m.text}</p>;

    return (
        <div className={styles.page}>
            <h2 className={styles.title}>Settings</h2>

            <section className={styles.card}>
                <h3>Профиль</h3>

                <div className={styles.avatarRow}>
                    <img src={assetUrl(user.avatarUrl, "https://placehold.co/96x96")} alt="" />
                    <div className={styles.avatarBtns}>
                        <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
                        <button type="button" disabled={busy} onClick={() => fileRef.current.click()}>
                            Загрузить фото
                        </button>
                        {user.avatarUrl && (
                            <button
                                type="button"
                                className={styles.secondary}
                                disabled={busy}
                                onClick={() => run("avatar", () => deleteAvatar(accessToken), "Аватар удалён")}
                            >
                                Удалить
                            </button>
                        )}
                    </div>
                </div>
                {note(msg.avatar)}

                <form onSubmit={saveName}>
                    <label className={styles.field}>
                        <span>Имя</span>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </label>
                    <button className={styles.saveBtn} disabled={busy}>Сохранить</button>
                    {note(msg.profile)}
                </form>
            </section>

            <section className={styles.card}>
                <h3>Пароль</h3>
                <form onSubmit={savePassword}>
                    <label className={styles.field}>
                        <span>Текущий пароль</span>
                        <input
                            type="password"
                            value={passwords.current}
                            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                        />
                    </label>
                    <label className={styles.field}>
                        <span>Новый пароль</span>
                        <input
                            type="password"
                            value={passwords.next}
                            onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                        />
                    </label>
                    <label className={styles.field}>
                        <span>Повтори новый пароль</span>
                        <input
                            type="password"
                            value={passwords.repeat}
                            onChange={(e) => setPasswords({ ...passwords, repeat: e.target.value })}
                        />
                    </label>
                    <button className={styles.saveBtn} disabled={busy}>Сменить пароль</button>
                    {note(msg.password)}
                </form>
            </section>

            <section className={styles.card}>
                <h3>Аккаунт</h3>
                <button type="button" className={styles.secondary} onClick={handleLogout}>
                    Выйти из аккаунта
                </button>
            </section>
        </div>
    );
}