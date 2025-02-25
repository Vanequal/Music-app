import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Library from "./pages/Library";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Player from "./components/Player";
import "./styles/main.scss";
import TrackList from "./components/TrackList.jsx";
import TrackDetail from "./components/TrackDetail.jsx";
import { PlayerProvider, PlayerContext } from "./context/PlayerContext";
import Callback from "../src/utils/Callback";

export const CLIENT_ID = '87ca0087d38e45649f938de34553da00';
export const REDIRECT_URI = 'https://music-app-seven-blond.vercel.app/';
export const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
export const RESPONSE_TYPE = 'token';
export const SCOPE = 'user-top-read user-library-read playlist-read-private playlist-read-collaborative user-modify-playback-state user-read-playback-state user-read-currently-playing playlist-modify-public playlist-modify-private';

export const authLink = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

const App = () => {

    const { themeColor } = useContext(PlayerContext);
    console.log("Цвет темы:", themeColor);

    return (
        <PlayerProvider>
        <Router>
            <PlayerContext.Consumer>
                {({ themeColor }) => (
                    <div className={`app-container`} style={{ backgroundColor: themeColor }}>
                        <div className="header" style={{ backgroundColor: themeColor }}>
                            <Header />
                            <a 
                                style={{ position: 'relative', left: '1375px', bottom: '10px' }} 
                                href={authLink}>
                                Войти через Spotify
                            </a>
                        </div>
                        <Sidebar />
                        <TrackDetail 
                            track={{
                                playlistName: "Мой плейлист",
                                trackName: "Лесник",
                                artist: "Король и Шут",
                                duration: "3:12"
                            }} 
                        />
                        <main className="main-content">
                            <div className='content-center'>
                                <TrackList />
                            </div>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/search" element={<Search />} />
                                <Route path="/library" element={<Library />} />
                                <Route path="/callback" element={<Callback />} />
                            </Routes>
                        </main>
                        <Player />
                    </div>
                )}
            </PlayerContext.Consumer>
        </Router>
    </PlayerProvider>

    );
};

export default App;
