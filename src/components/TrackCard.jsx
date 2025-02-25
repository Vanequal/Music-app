import React, { useContext, useEffect, useState } from 'react';
import styles from '../UI/TrackCard.module.scss';
import defaultAlbumImage from '../assets/main.png';
import { PlayerContext } from "../context/PlayerContext.jsx";
import Spotify from 'spotify-web-api-js';

const spotifyApi = new Spotify();

const TrackCard = () => {
    const { selectedPlaylist, currentTrack } = useContext(PlayerContext);
    const [totalTracks, setTotalTracks] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const [artistName, setArtistName] = useState('');

    useEffect(() => {
        if (selectedPlaylist) {
            setTotalTracks(selectedPlaylist.tracks.length);
            setTotalDuration(selectedPlaylist.tracks.reduce((sum, track) => sum + track.duration_ms, 0));
        } else {
            const token = window.localStorage.getItem('spotifyToken');
            if (token) {
                spotifyApi.setAccessToken(token);
                spotifyApi.getMyTopTracks({ limit: 50 }).then(data => {
                    const tracks = data.items;
                    setTotalTracks(tracks.length);
                    const totalDurationMs = tracks.reduce((sum, track) => sum + track.duration_ms, 0);
                    setTotalDuration(totalDurationMs);
                }).catch(err => console.error(err));
            }
        }
    }, [selectedPlaylist, currentTrack]);


    const formatDuration = (durationMs) => {
        const totalSeconds = Math.floor(durationMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours}ч ${minutes}м ${seconds}с`;
    };

    console.log(artistName)

    return (
        <div className="container" style={{ display: 'flex' }}>
            <img
                className={styles.albumImg}
                src={selectedPlaylist?.image || defaultAlbumImage}
                alt="Обложка альбома"
            />
            <div>
                <h1 className="title" style={{ color: 'white', marginTop: '120px' }}>
                    {selectedPlaylist ? selectedPlaylist.name : 'Главный'}
                </h1>
                <h1 className="is-size-4">
                    <span className="is-size-6" style={{ color: '#cfcfcf' }}>
                        {totalTracks} треков, {formatDuration(totalDuration)}
                    </span>
                </h1>
            </div>
        </div>
    );
};

export default TrackCard;
