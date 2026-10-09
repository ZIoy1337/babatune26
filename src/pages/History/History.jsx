import TrackListItem from "../../components/TrackListItem/TrackListItem";
import styles from "../Home/Home.module.css";

const mockHistory = [
    { id: 1, number: 1, name: "Blinding Lights", author: "The Weeknd", date: "22.09.2026", duration: "3:20" },
    { id: 2, number: 2, name: "Peaches", author: "Justin Bieber", date: "21.09.2026", duration: "3:18" },
];

export default function History() {
    return (
        <section className={styles.section}>
            <h2 className={styles.sectionTitle}>History</h2>
            {mockHistory.map((track) => (
                <TrackListItem key={track.id} {...track} />
            ))}
        </section>
    );
}