import React, { useEffect, useState, useContext } from 'react';
import Spotify from 'spotify-web-api-js';
import styles from "../UI/TrackList.module.scss";
import { PlayerContext } from "../context/PlayerContext.jsx";
import TrackCard from "./TrackCard.jsx";
import { IoMusicalNoteOutline } from "react-icons/io5";
import { MdOutlineAccessTime } from "react-icons/md";
import { authLink } from '../App';  // Импортируем authLink

const spotifyApi = new Spotify();

const TrackList = () => {
    const { updateCurrentTrack, searchTerm, selectedPlaylist, defaultTracks, setArtists, displayedTracks, setDisplayedTracks } = useContext(PlayerContext);
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        const token = window.localStorage.getItem('spotifyToken');
        if (token) {
            spotifyApi.setAccessToken(token);
            spotifyApi.getMyTopTracks({ limit: 50 })
                .then(data => {
                    setTracks(data.items);
                })
                .catch(err => {
                    if (err.status === 401) {
                        console.error('Token expired or invalid. Please log in again.');
                        window.localStorage.removeItem('spotifyToken');
                        window.location.href = authLink;
                    } else {
                        console.error(err);
                    }
                });
        } else {
            window.location.href = authLink;
        }
    },  []);


    useEffect(() => {
        if (selectedPlaylist) {
            spotifyApi.getPlaylistTracks(selectedPlaylist.id)
                .then(data => {
                    const playlistTracks = data.items.map(item => item.track);
                    setDisplayedTracks(playlistTracks);
                    const uniqueArtists = Array.from(
                        new Set(playlistTracks.flatMap(track => track.artists.map(artist => artist.name)))
                    );
                    setArtists(uniqueArtists);
                })
                .catch(err => console.error('Error fetching playlist tracks:', err));
        } else {
            setDisplayedTracks(defaultTracks);
            const uniqueArtists = Array.from(
                new Set(defaultTracks.flatMap(track => track.artists.map(artist => artist.name)))
            );
            setArtists(uniqueArtists);
        }
    }, [selectedPlaylist, defaultTracks]);



    const handleTrackClick = (track) => {
        updateCurrentTrack(track);
    };

    const filteredTracks = displayedTracks.filter(track =>
        track.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='container'>
            <div className={styles.boxTracks}>
                <TrackCard />
                <div style={{ display: 'flex' }}>
                    <h1 className='ml-5 is-size-6' style={{ color: '#d5d5d5' }}># Название песни</h1>
                    <h1 style={{ marginLeft: '125px', color: '#d5d5d5' }}># Название альбома </h1>
                    <i title={'Длительность'}>
                        <MdOutlineAccessTime style={{ marginLeft: '150px' }} color={'#d5d5d5'} size={22} />
                    </i>
                </div>
                <hr style={{ height: '2px', width: '100%', color: 'white'}} />
                <div className={styles.tracksContainer}>
                    {filteredTracks.map((track) => (
                        <div key={track.id} className={styles.track} onClick={() => handleTrackClick(track)}>
                            <i className='mt-4'><IoMusicalNoteOutline size={22} /></i>
                            <img className='ml-2' src={track.album.images[0].url} alt="" />
                            <p className='ml-3'>
                                <strong className='is-size-5 has-text-white'>{track.name}</strong>
                                <br /> {track.artists[0].name}
                            </p>
                            <p className='ml-6 mt-4' style={{ wordBreak: 'break-word' }}>{track.album.name}</p>
                            <p className='mt-4' style={{ marginLeft: '130px' }}>{Math.floor(track.duration_ms / 60000)}:{('0' + Math.floor((track.duration_ms % 60000) / 1000)).slice(-2)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrackList;
