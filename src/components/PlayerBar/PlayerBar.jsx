import { useState } from "react";
import { IoPlaySkipBack, IoPlaySkipForward, IoPlay, IoPause } from "react-icons/io5";
import styles from "./PlayerBar.module.css";

export default function PlayerBar() {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className={styles.player}>
            <div className={styles.progress}>
                <div className={styles.progressFill}></div>
            </div>

            <div className={styles.content}>
                <div className={styles.track}>
                    <div className={styles.cover}>PHOTO</div>
                    <div>
                        <div>NAME</div>
                        <div className={styles.author}>AUTHOR</div>
                    </div>
                </div>

                <div className={styles.controls}>
                    <button><IoPlaySkipBack /></button>
                    <button className={styles.playBtn} onClick={() => setIsPlaying(!isPlaying)}>
                        {isPlaying ? <IoPause /> : <IoPlay />}
                    </button>
                    <button><IoPlaySkipForward /></button>
                </div>

                <div className={styles.time}>0:00</div>
            </div>
        </div>
    );
}