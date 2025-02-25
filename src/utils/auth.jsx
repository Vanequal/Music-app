export const getToken = () => {
    let token = localStorage.getItem("spotifyToken");

    // Если токена нет в localStorage, пробуем достать его из URL
    if (!token) {
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.substring(1)); // Убираем #
        token = params.get("access_token");

        if (token) {
            localStorage.setItem("spotifyToken", token);
            window.history.pushState({}, document.title, window.location.pathname); // Чистим URL
        } else {
            window.location.href = authLink; // Если нет токена, отправляем на авторизацию
        }
    }

    return token;
};
