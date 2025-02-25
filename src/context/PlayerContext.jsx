import {createContext, useState, useEffect} from "react";
import Spotify from 'spotify-web-api-js';

export const PlayerContext = createContext();
const spotifyApi = new Spotify();

export const PlayerProvider = ({children}) => {
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeDevice, setActiveDevice] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [tracks, setTracks] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null)
    const [defaultTracks, setDefaultTracks] = useState([])
    const [artists, setArtists] = useState([]);
    const [displayedTracks, setDisplayedTracks] = useState([]);
    const [volume, setVolume] = useState(0.5);
    const [themeColor, setThemeColor] = useState('#171515');

    useEffect(() => {
        const token = window.localStorage.getItem('spotifyToken');
        if (token) {
            spotifyApi.setAccessToken(token);
            spotifyApi.getMyDevices().then(data => {
                const devices = data.devices;
                console.log('Devices:', devices);
                if (devices.length > 0) {
                    const activeDevice = devices.find(device => device.is_active) || devices[0];
                    setActiveDevice(activeDevice.id);
                    console.log('Active Device:', activeDevice);
                    spotifyApi.transferMyPlayback([activeDevice.id], {play: false}).catch(err => {
                        console.error('Transfer Playback Error:', err);
                    });
                } else {
                    console.error('No active devices found.');
                }
            }).catch(err => console.error('Get Devices Error:', err));

            spotifyApi.getMyTopTracks({limit: 50}).then(data => {
                setTracks(data.items);
                setDefaultTracks(data.items); 
                const uniqueArtists = Array.from(
                    new Set(data.items.flatMap(track => track.artists.map(artist => artist.name)))
                );
                setArtists(uniqueArtists);
            }).catch(err => console.error('Get Tracks Error:', err));
        }
    }, []);

    const updateCurrentTrack = (track) => {
        setCurrentTrack(track);
        playTrack(track);
    };

    const playTrack = async (track) => {
        const token = window.localStorage.getItem('spotifyToken');
        if (!token) {
            console.error('Токен доступа отсутствует. Пожалуйста, войдите в систему.');
            return;
        }
        if (!activeDevice) {
            console.error('Нет активного устройства для воспроизведения.');
            return;
        }
        try {
            spotifyApi.setAccessToken(token);
            console.log('Воспроизведение трека:', track);
            console.log('Используемое устройство:', activeDevice);
            await spotifyApi.transferMyPlayback([activeDevice], {play: true});
            await spotifyApi.play({
                device_id: activeDevice,
                uris: [track.uri]
            });
            setIsPlaying(true);
            console.log('Трек успешно воспроизводится.');
        } catch (err) {
            console.error('Ошибка воспроизведения трека:', err);
            handlePlaybackError(err);
        }
    };

    const handlePlaybackError = (err) => {
        if (err.status === 403) {
            console.error('Доступ к воспроизведению этого трека запрещен. Проверьте свои области действия и активный проигрыватель.');
        } else if (err.status === 404) {
            console.error('Трек не найден. Убедитесь, что URI трека корректен.');
        } else {
            console.error('Произошла ошибка при воспроизведении:', err);
        }
    };

    const pauseTrack = () => {
        spotifyApi.pause().then(() => {
            setIsPlaying(false);
        }).catch(err => console.error('Ошибка при приостановке воспроизведения:', err));
    };

    const playNextTrack = () => {
        if (currentTrack && tracks.length > 0) {
            const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
            const nextIndex = (currentIndex + 1) % tracks.length;
            updateCurrentTrack(tracks[nextIndex]);
        }
    };

    const playPreviousTrack = () => {
        if (currentTrack && tracks.length > 0) {
            const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
            const previousIndex = (currentIndex - 1 + tracks.length) % tracks.length;
            updateCurrentTrack(tracks[previousIndex]);
        }
    };


    const createPlaylist = async (name, description) => {
        const token = window.localStorage.getItem('spotifyToken');
        const userId = await spotifyApi.getMe().then(data => data.id);

        if (!token) {
            console.error('Нет токена доступа');
            return;
        }

        spotifyApi.setAccessToken(token);

        try {
            const playlist = await spotifyApi.createPlaylist(userId, {
                name,
                description,
                public: false
            });

            console.log('Новый плейлист создан:', playlist);
            return playlist.id;
        } catch (err) {
            console.error('Ошибка при создании плейлиста:', err);
        }
    };

    const addTracksToPlaylist = async (playlistId, trackUris) => {
        const token = window.localStorage.getItem('spotifyToken');
        if (!token) {
            console.error('No access token available');
            return;
        }

        spotifyApi.setAccessToken(token);

        try {
            await spotifyApi.addTracksToPlaylist(playlistId, trackUris);
            console.log('Tracks added to playlist');
            const updatedTracksData = await spotifyApi.getPlaylistTracks(playlistId);
            const updatedTracks = updatedTracksData.items.map(item => item.track);

            setSelectedPlaylist(prev => ({
                ...prev,
                tracks: updatedTracks
            }));
        } catch (err) {
            console.error('Error adding tracks to playlist:', err);
        }
    };

    const filterTracksByArtist = (artist) => {
        if (selectedPlaylist && selectedPlaylist.tracks) {
            const filteredTracks = selectedPlaylist.tracks.filter(track =>
                track.artists.some(a => a.name === artist)
            );
            setDisplayedTracks(filteredTracks);
        } else {
            const filteredTracks = defaultTracks.filter(track =>
                track.artists.some(a => a.name === artist)
            );
            setDisplayedTracks(filteredTracks);
        }
    };

    const changeVolume = async (value) => {
        const token = window.localStorage.getItem('spotifyToken');
        if (!token) {
            console.error('Нет токена доступа.');
            return;
        }

        try {
            spotifyApi.setAccessToken(token);
            await spotifyApi.setVolume(value * 100);
            setVolume(value);
            console.log(`Громкость изменена на: ${value}`);
        } catch (err) {
            console.error('Ошибка при изменении громкости:', err);
        }
    };

    return (
        <PlayerContext.Provider
            value={{
                currentTrack,
                isPlaying,
                createPlaylist,
                addTracksToPlaylist,
                updateCurrentTrack,
                playTrack,
                pauseTrack,
                playNextTrack,
                playPreviousTrack,
                tracks,
                setTracks,
                searchTerm,
                setSearchTerm,
                defaultTracks,
                selectedPlaylist,
                setSelectedPlaylist,
                artists,
                setArtists,
                filterTracksByArtist,
                displayedTracks,
                setDisplayedTracks,
                volume,
                changeVolume,
                themeColor, 
                setThemeColor 
            }}>
            {children}
        </PlayerContext.Provider>
    );
};
