// pages/Home/Home.jsx
import TrackCard from "../../components/Cards/TrackCard";
import { allTracks } from "../../data/tracks";
import { useLiked } from "../../store/LikedContext";
import styles from "./Home.module.css";

export default function Home() {
    const { likedIds, toggleLike } = useLiked();
    const mockRecent = allTracks.slice(0, 3);

    return (
        <>
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Tacks</h2>
                <div className={styles.tracksRow}>
                    {allTracks.map((track) => (
                        <TrackCard
                            key={track.id}
                            {...track}
                            liked={likedIds.includes(track.id)}
                            onToggleLike={() => toggleLike(track.id)}
                        />
                    ))}
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Recent</h2>
                <div className={styles.recentGrid}>
                    {mockRecent.map((track) => (
                        <TrackCard
                            key={track.id}
                            {...track}
                            liked={likedIds.includes(track.id)}
                            onToggleLike={() => toggleLike(track.id)}
                        />
                    ))}
                </div>
            </section>
        </>
    );
}