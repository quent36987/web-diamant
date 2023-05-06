// Home page to set the username
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppState } from '../componant/Context';
import { emit } from '../utils/socket';
import './home.css';
import { path } from '../constant/router';

function Home() {
    const [username, setUsername] = useState('');
    const {socket, setUser} = AppState();
    const navigate = useNavigate();

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setUsername(event.target.value);
    }

    const handleUsernameSubmit = () : void => {
        emit(socket,'set-username', username);
    }

    useEffect(() => {
        if(socket == null) {
            return;
        }

        socket.on('set-username-success', ():void => {
            setUser(username);
            navigate(path.room);
        });

        // TODO: handle disconnect
        // socket.on('disconnect', () => {
        //     console.log('disconnected');
        //     navigate(path.home);
        // });
    }, [socket]);

    return (
        <div className="main-page">
            <h1 className="main-page-title">DIAMANT</h1>

            <input
                className="username-input"
                type="text"
                placeholder="Entrez votre nom d'utilisateur"
                value={username}
                onChange={handleUsernameChange}
            />

            <button className="play-button" onClick={handleUsernameSubmit}>
                PLAY
            </button>
        </div>
    );
}

export { Home };
