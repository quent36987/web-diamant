// FIXME: Lobby pluotto room
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppState } from '../../componant/Context';
import './room.css';
import { path } from '../../constant/router';
import { emit } from '../../utils/socket';

function Room() {
    const [room, setRoom] = useState('');
    const { socket } = AppState();
    const navigate = useNavigate();

    const handleRoomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRoom(event.target.value);
    };

    const handleJoinRoom = () => {
        emit(socket, 'join-room', room);
    };

    const handleCreateRoom = () => {
        emit(socket, 'create-room');
    };

    useEffect(() => {
        if (socket === null) navigate(path.home);
    }, [socket]);

    useEffect(() => {
        if (socket === null) return;

        socket.on('join-room-success', (id) => {
            console.log('Joined room successfully!');
            navigate(`${path.waiting_room}/${id}`);
        });
    }, [socket]);

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

            <div className="rule-button" onClick={() => navigate(path.rules)}>
                {'voir les règles ->'}
            </div>
        </div>
    );
}

export { Room };
