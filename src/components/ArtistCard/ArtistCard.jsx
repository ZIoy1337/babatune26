import styles from "./ArtistCard.module.css";

export default function ArtistCard({ name, image }) {
    return (
        <div className={styles.card}>
            <img className={styles.avatar} src={image} alt={name} />
            <div className={styles.name}>{name}</div>
        </div>
    );
}