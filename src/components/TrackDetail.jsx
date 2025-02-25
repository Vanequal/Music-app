import React, { useContext, useState, useEffect } from 'react';
import styles from "../UI/TrackDetail.module.scss";
import { PlayerContext } from "../context/PlayerContext.jsx";

const TrackDetail = () => {
    const { currentTrack, isPlaying } = useContext(PlayerContext);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        setProgress(0);

        if (!currentTrack || !isPlaying) return;

        const duration = currentTrack.duration_ms;
        let interval;

        if (isPlaying) {
            interval = setInterval(() => {
                setProgress(prev => {
                    const nextProgress = prev + 1000;
                    return nextProgress >= duration ? duration : nextProgress;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [currentTrack, isPlaying]);

    if (!currentTrack) {
        return <div className={styles.trackDetail}>Выберите трек, чтобы увидеть детали</div>;
    }

    const { name, album, artists, duration_ms, album: { images } } = currentTrack;
    const progressPercentage = (progress / duration_ms) * 100;

    return (
        <div className={styles.trackDetail}>
            <div className={styles.trackInfo}>
                <img src={images[0].url} alt="Album Art" />
                <div className={styles.textInfo}>
                    <h2 className={styles.trackName}>{name}</h2>
                    <h3 className={styles.artistName}>
                        {artists.map(artist => artist.name).join(', ')}
                    </h3>
                </div>
                <div className={styles.trackDuration}>
                    {Math.floor(duration_ms / 60000)}:
                    {('0' + Math.floor((duration_ms % 60000) / 1000)).slice(-2)}
                </div>
            </div>
            <div className={styles.albumName}>{album.name}</div>
            <div className={styles.progressBar}>
                <div
                    className={styles.progress}
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default TrackDetail;
