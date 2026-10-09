import TrackCard from "../../components/Cards/TrackCard";
import styles from "../Home/Home.module.css";

const mockLibrary = [
    { id: 1, name: "Blinding Lights", author: "The Weeknd", image: "https://placehold.co/140x140" },
    { id: 2, name: "Levitating", author: "Dua Lipa", image: "https://placehold.co/140x140" },
    { id: 3, name: "Save Your Tears", author: "The Weeknd", image: "https://placehold.co/140x140" },
];

export default function Library() {
    return (
        <section className={styles.section}>
            <h2 className={styles.sectionTitle}>My Library</h2>
            <div className={styles.tracksRow}>
                {mockLibrary.map((track) => (
                    <TrackCard key={track.id} {...track} />
                ))}
            </div>
        </section>
    );
}