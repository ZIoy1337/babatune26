// pages/Liked/Liked.jsx
import TrackCard from "../../components/Cards/TrackCard";
import { allTracks } from "../../data/tracks";
import { useLiked } from "../../store/LikedContext";
import styles from "../Home/Home.module.css";

export default function Liked() {
    const { likedIds, toggleLike } = useLiked();
    const likedTracks = allTracks.filter((track) => likedIds.includes(track.id));

    return (
        <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Liked</h2>

            {likedTracks.length === 0 ? (
                <p style={{ opacity: 0.6 }}>Тут пока пусто — полайкай что-нибудь на главной.</p>
            ) : (
                <div className={styles.tracksRow}>
                    {likedTracks.map((track) => (
                        <TrackCard
                            key={track.id}
                            {...track}
                            liked={true}
                            onToggleLike={() => toggleLike(track.id)}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}