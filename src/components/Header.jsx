import React, { useState, useContext } from "react";
import { IoSearch, IoHomeOutline } from "react-icons/io5";
import { TfiLayoutMediaCenter } from "react-icons/tfi";
import { PiLineVerticalLight } from "react-icons/pi";
import { IoIosMenu } from "react-icons/io";
import { BsBell } from "react-icons/bs";
import { GoPeople } from "react-icons/go";
import { MdOutlineAccountCircle } from "react-icons/md";
import styles from "../UI/Header.module.scss";
import { PlayerContext } from "../context/PlayerContext.jsx";
import Modal from "./modal/Modal.jsx";

const Header = () => {
    const [isFocused, setIsFocused] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { setSearchTerm, setThemeColor, themeColor } = useContext(PlayerContext);
    const handleRefresh = () => {
        window.location.reload();
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);


    const handleThemeChange = (event) => {
        setThemeColor(event.target.value);
    };

    const handleApplyTheme = () => {
        console.log('Применение темы:', themeColor);
    };



    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <button onClick={openModal}>
                    <div className={styles.circle}>
                        <IoIosMenu size={22} color={'#9c9898'} />
                    </div>
                </button>
                <button>
                    <div className={styles.circle}>
                        <a href="https://open.spotify.com/">
                            <IoHomeOutline size={22} color={'#9c9898'} />
                        </a>
                    </div>
                </button>
                <div className="field" style={{ position: "relative" }}>
                    <button title="Поиск">
                        <IoSearch
                            size={32}
                            color={isFocused ? 'white' : '#9c9898'}
                            style={{
                                position: 'absolute',
                                bottom: '1px',
                                left: '10px',
                                transform: 'translateY(-50%)',
                                transition: 'color 0.3s ease'
                            }}
                        />
                    </button>
                    <button title="Обзор" onClick={handleRefresh}>
                        <TfiLayoutMediaCenter
                            size={32}
                            color={isFocused ? 'white' : '#9c9898'}
                            style={{
                                position: 'absolute',
                                bottom: '1px',
                                left: '390px',
                                transform: 'translateY(-50%)',
                                transition: 'color 0.3s ease'
                            }}
                        />
                    </button>
                    <PiLineVerticalLight
                        size={32}
                        color={isFocused ? 'white' : '#9c9898'}
                        style={{
                            position: 'absolute',
                            bottom: '1px',
                            left: '350px',
                            transform: 'translateY(-50%)',
                            transition: 'color 0.3s ease'
                        }}
                    />
                    <input
                        maxLength={35}
                        placeholder="Какую песню ты хочешь послушать?"
                        className={`${styles.search__input} ${styles.text__input}`}
                        type="text"
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onMouseEnter={() => setIsFocused(true)}
                        onMouseLeave={() => setIsFocused(false)}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <button title='Что нового?' className={styles.iconButton}>
                    <a href="https://open.spotify.com/content-feed"><BsBell size={22} color={'#9c9898'} /></a>
                </button>
                <button title={'О нас'} className={styles.iconButton} style={{ marginLeft: '20px' }}>
                    <a href="https://www.spotify.com/uz/about-us/contact/"><GoPeople size={22} color={'#9c9898'} /></a>
                </button>
                <PiLineVerticalLight
                    size={32}
                    color={'#9c9898'}
                    style={{ marginLeft: '30px' }}
                />
                <MdOutlineAccountCircle className="ml-3" size={32} color={'#9c9898'} />
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <div className='field mt-5'>
                    <h1 className="has-text-centered title is-4 has-text-white">Выбрать цвет темы</h1>
                    <input
                        type="color"
                        className='input'
                        value={themeColor}
                        onChange={handleThemeChange}
                    />
                    <br />
                </div>
            </Modal>
        </div>
    );
};

export default Header;
