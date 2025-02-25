
import React, { useContext } from 'react';
import PlayerControls from './PlayerControls';
import styles from '../UI/Player.module.scss';
import { CiVolumeHigh } from "react-icons/ci";
import { PlayerContext } from "../context/PlayerContext.jsx";

const Player = () => {
    const { currentTrack, changeVolume, volume } = useContext(PlayerContext);

    if (!currentTrack) {
        return <div className={styles.trackDetail}>Трек не найден</div>;
    }

    const { name, artists, album } = currentTrack;
    const artistNames = artists.map(artist => artist.name).join(', ');

    return (
        <div className={styles.player}>
            <div className={styles.trackInfo}>
                <img src={album.images[0].url} alt="Album cover" className={styles.albumCover} />
                <div className={styles.trackDetails}>
                    <span className={styles.trackName}>{name}</span>
                    <span className={styles.artistName}>{artistNames}</span>
                </div>
            </div>
            <PlayerControls />
            <div className={styles.volumeControl} style={{ display: 'flex' }}>
                <CiVolumeHigh size={32} color={'white'} style={{ position: 'relative', right: '10px' }} />
                <input type="range"
                       min="0"
                       max="1"
                       step="0.01"
                       className={styles.volumeSlider}
                       value={volume}
                       onChange={(e) => changeVolume(parseFloat(e.target.value))}/>
            </div>
        </div>
    );
};

export default Player;
