import { IoHeart, IoHeartOutline } from "react-icons/io5";
import styles from "./TrackCard.module.css";

export default function TrackCard({ name, author, image, liked, onToggleLike }) {
    return (
        <div className={styles.card}>
            <div className={styles.imageWrap}>
                <img src={image} alt={name} />
                <div className={styles.overlay}></div>

                {onToggleLike && (
                    <button
                        className={`${styles.likeBtn} ${liked ? styles.likeBtnActive : ""}`}
                        onClick={onToggleLike}
                    >
                        {liked ? <IoHeart /> : <IoHeartOutline />}
                    </button>
                )}
            </div>
            <div className={styles.name}>{name}</div>
            <div className={styles.author}>{author}</div>
        </div>
    );
}