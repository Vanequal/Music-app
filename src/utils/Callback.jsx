
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Callback = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.hash) {
            const token = new URLSearchParams(location.hash.replace('#', '?')).get('access_token');
            if (token) {
                window.localStorage.setItem('spotifyToken', token);
                navigate('/');
            }
        }
    }, [location, navigate]);

    return <div>Loading...</div>;
};

export default Callback;
