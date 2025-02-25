import React, { useState, useEffect, useContext } from "react";
import styles from "../UI/Sidebar.module.scss";
import Modal from "./modal/Modal.jsx";
import { CgComponents } from "react-icons/cg";
import { CiCirclePlus } from "react-icons/ci";
import albumImage from "../assets/album.webp";
import { IoTrashOutline } from "react-icons/io5";
import { PlayerContext } from "../context/PlayerContext.jsx";
import Spotify from 'spotify-web-api-js';
import { RiPlayList2Fill } from "react-icons/ri";
import { IoMusicalNotesOutline } from "react-icons/io5";

const spotifyApi = new Spotify();

const Sidebar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMenuVisible, setIsMenuVisible] = useState(true);
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const [newPlaylistImage, setNewPlaylistImage] = useState(albumImage);
    const [playlists, setPlaylists] = useState([]);
    const [activeMenu, setActiveMenu] = useState("playlists");
    const [activeArtist, setActiveArtist] = useState(null);
    const { setSelectedPlaylist, createPlaylist, artists, filterTracksByArtist } = useContext(PlayerContext);

    useEffect(() => {
        const storedPlaylists = JSON.parse(localStorage.getItem('playlists')) || [];
        setPlaylists(storedPlaylists);
    }, []);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const toggleMenuVisibility = () => setIsMenuVisible(!isMenuVisible); 

    const handlePlaylistNameChange = (e) => setNewPlaylistName(e.target.value);

    const handlePlaylistImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setNewPlaylistImage(URL.createObjectURL(e.target.files[0]));
        }
    };
 
    const handlePlaylistSelect = async (playlist) => {
        try {
            const playlistTracks = await spotifyApi.getPlaylistTracks(playlist.id);
            const updatedTracks = playlistTracks.items.map(item => item.track);

            const tracksWithDuration = updatedTracks.map(track => ({
                ...track,
                duration_ms: track.duration_ms
            }));

            setSelectedPlaylist({
                ...playlist,
                tracks: tracksWithDuration
            });
        } catch (err) {
            console.error('Ошибка при получении треков плейлиста:', err);
        }
    };

    const addPlaylist = async () => {
        if (newPlaylistName) {
            const playlistId = await createPlaylist(newPlaylistName, 'Описание плейлиста');
            if (playlistId) {
                const newPlaylist = {
                    id: playlistId,
                    name: newPlaylistName,
                    image: newPlaylistImage,
                    tracks: []
                };

                const updatedPlaylists = [...playlists, newPlaylist];
                setPlaylists(updatedPlaylists);
                localStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
                setNewPlaylistName("");
                setNewPlaylistImage(albumImage);
                closeModal();
            }
        }
    };

    const removePlaylist = (index) => {
        const updatedPlaylists = playlists.filter((_, i) => i !== index);
        setPlaylists(updatedPlaylists);
        localStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
    };

    const handleArtistSelect = (artist) => {
        filterTracksByArtist(artist);
    };

    const toggleMenu = (menu) => {
        setActiveMenu(menu);
        setActiveArtist(artist);
    };

    return (
        <div className="container" style={{ position: "relative" }}>
            <div className={styles.sidebar}>
                <div className={styles.menuHeader}>
                    <button
                        title={isMenuVisible ? "Закрыть медиатеку" : "Открыть медиатеку"}
                        className={styles.iconButton}
                        onClick={toggleMenuVisibility}
                    >
                        <CgComponents size={32} color={"white"} />
                    </button>
                </div>

                {isMenuVisible && (
                    <div className={styles.menu}>
                        <div className={`${styles.menuTitle}`}>Медиатека</div>
                        <div className={styles.iconEnd}>
                            <button title='Создать плейлист' onClick={openModal}>
                                <CiCirclePlus size={32} color={'white'} />
                            </button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                            <button
                                className={styles.playlistButton}
                                onClick={() => toggleMenu("playlists")}
                                style={activeMenu === "playlists" ? { fontWeight: "bold" } : {}}
                            >
                                Плейлисты
                            </button>
                            <button
                                className={styles.songButton}
                                onClick={() => toggleMenu("artists")}
                                style={activeMenu === "artists" ? { fontWeight: "bold" } : {}}
                            >
                                Исполнители
                            </button>
                        </div>

                        {activeMenu === "playlists" && (
                            <div>
                                {playlists && playlists.length > 0 ? (
                                    playlists.map((playlist, index) => (
                                        <div key={index} className={styles.menuItem}>
                                            <div className={styles.trackInfo} onClick={() => handlePlaylistSelect(playlist)}>
                                                <img src={playlist.image} alt="" />
                                                <strong className={styles.albumName}>{playlist.name}</strong>
                                                <button onClick={() => removePlaylist(index)}>
                                                    <IoTrashOutline size={32} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : null}
                            </div>
                        )}

                        {activeMenu === "artists" && (
                            <div className={styles.artists}>
                                {artists.map((artist, index) => (
                                    <div
                                        key={index}
                                        className={`${styles.artistItem} ${activeArtist === artist ? styles.active : ""}`}
                                        onClick={() => handleArtistSelect(artist)}
                                    >
                                        {artist}
                                    </div>
                                ))} 
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <div className='field mt-5'>
                    <IoMusicalNotesOutline color="white" size={42} style={{ position: 'relative', left: '130px', bottom: '20px' }} />
                    <h1 className="has-text-centered title is-4 has-text-white">Создание Плейлиста</h1>
                    <label className="is-size-5">Введите название плейлиста</label>
                    <input
                        type="text"
                        className='input'
                        value={newPlaylistName}
                        onChange={handlePlaylistNameChange}
                        required
                    />
                    <br />
                    <label style={{ position: 'relative', top: '20px' }} htmlFor="file-upload">
                        Добавить изображение
                    </label>
                    <input
                        className='mt-3 is-size-6'
                        type="file"
                        id="file-upload"
                        onChange={handlePlaylistImageChange}
                        placeholder='Фото плейлиста'
                    />
                    <button className='button is-fullwidth is-size-6 mt-6' onClick={addPlaylist}>
                        Нажмите чтобы добавить плейлист
                    </button>
                    <RiPlayList2Fill style={{ position: 'relative', left: '130px', top: '40px' }} color="white" size={52} />
                </div>
            </Modal>
        </div>
    );
};

export default Sidebar;
