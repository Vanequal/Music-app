import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/main.scss';
import 'bulma/css/bulma.css'
import { PlayerProvider } from "./context/PlayerContext";

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <PlayerProvider>
        <App />
    </PlayerProvider>
  </StrictMode>
)
