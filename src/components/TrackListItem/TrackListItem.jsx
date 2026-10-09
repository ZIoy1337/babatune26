import styles from "./TrackListItem.module.css";

export default function TrackListItem({ number, name, author, date, duration }) {
    return (
        <div className={styles.row}>
            <div className={styles.number}>{number}</div>
            <div className={styles.info}>
                <div className={styles.name}>{name}</div>
                <div className={styles.author}>{author}</div>
            </div>
            <div className={styles.date}>{date}</div>
            <div className={styles.duration}>{duration}</div>
        </div>
    );
}