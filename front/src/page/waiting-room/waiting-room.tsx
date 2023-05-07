// see people in the room
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppState } from '../../componant/Context';
import './waiting-room.css';
import { path } from '../../constant/router';
import { emit } from '../../utils/socket';

interface IRoom {
    players: string[];
    owner: string;
    id: string;
}

function WaitingRoom() {
    const [room, setRoom] = useState<IRoom>(null);
    const { socket } = AppState();
    const navigate = useNavigate();
    const params = useParams();
    const [isCreator, setIsCreator] = useState(false);

    const handleStartGame = () => {
        socket.emit('start-game', params.id);
    };

    useEffect(() => {
        if (socket === null) navigate(path.home);
    }, [socket]);

    useEffect(() => {
        if (socket === null) return;

        socket.on('room-update', (room: IRoom) => {
            setRoom(room);
            setIsCreator(room.owner === socket.id);
            console.log('room-update', room);
        });

        socket.on('start-game-success', (id) => {
            navigate(`${path.game}/${id}`);
        });

        if (params.id) {
            emit(socket, 'room-info', params.id);
        }
    }, [params.id]);

    return (
        <div className="waiting-room">
            <h2 className="waiting-room-subtitle">
                Attente d'autres joueurs
                <span className="dots"></span>
            </h2>

            <p className="game-code">Code de la partie : {params?.id ?? 'xxxx'}</p>

            <div className="player-list">
                <h3>Joueurs :</h3>
                <ul>
                    {room && room.players.map((player, index) => <li key={index}>{player}</li>)}
                </ul>
            </div>

            {isCreator && (
                <button className="start-game-button" onClick={handleStartGame}>
                    Lancer la partie
                </button>
            )}

            <div className="rule-button" onClick={() => navigate(path.rules)}>
                {'voir les règles ->'}
            </div>
        </div>
    );
}

export { WaitingRoom };
