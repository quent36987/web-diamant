
// FIXME: Lobby pluotto room
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppState } from '../componant/Context';
import './room.css';
import { path } from '../constant/router';

function Room() {
    const [room, setRoom] = useState('');
    const {socket} = AppState();
    const navigate = useNavigate();

    const handleRoomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRoom(event.target.value);
    }

    const handleJoinRoom = () => {
        socket.emit('join-room', room );
        console.log('join room');
    }

    const handleCreateRoom = () => {
        socket.emit('create-room');
        console.log('create room');
    }

    useEffect(() => {
        socket.on('join-room-success', (id) => {
            console.log('Joined room successfully!');
            navigate(`${path.waiting_room}/${id}`);
        });
    });

    return (
        <div className="game-lobby">
            <h2 className="subtitle">Lobby du jeu</h2>
            <button className="create-game-button" onClick={handleCreateRoom}>
                Créer une partie
            </button>
            <div className="join-game">
                <input
                    className="game-code-input"
                    type="text"
                    placeholder="Code"
                    value={room}
                    onChange={handleRoomChange}
                />

                <button className="join-game-button" onClick={handleJoinRoom}>
                    Rejoindre
                </button>
            </div>
        </div>
    );
}

export { Room };
