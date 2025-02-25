import React, { useContext } from 'react';
import { FaPlay, FaPause, FaBackward, FaForward } from 'react-icons/fa';
import styles from '../UI/PlayerControls.module.scss';
import { PlayerContext } from "../context/PlayerContext.jsx";

const PlayerControls = () => {
    const { isPlaying, playTrack, pauseTrack, currentTrack, playNextTrack, playPreviousTrack } = useContext(PlayerContext);

    const handlePlayPause = () => {
        if (isPlaying) {
            pauseTrack();
        } else {
            playTrack(currentTrack);
        }
    };

    return (
        <div className={styles.controls}>
            <button className={styles.controlButton} onClick={playPreviousTrack}><FaBackward /></button>
            <button className={styles.playButton} onClick={handlePlayPause}>
                {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button className={styles.controlButton} onClick={playNextTrack}><FaForward /></button>
        </div>
    );
};

export default PlayerControls;
