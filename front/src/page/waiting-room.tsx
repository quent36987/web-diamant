
// see people in the room
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppState } from '../componant/Context';
import './waiting-room.css';

interface IRoom {
    players: string[];
    owner: string;
    id: string;
}

function WaitingRoom(){
    const [room, setRoom] = useState<IRoom>(null);
    const {socket} = AppState();
    const navigate = useNavigate();
    const params = useParams();
    const [isCreator, setIsCreator] = useState(false);

    const handleStartGame = () => {
        socket.emit('start-game', params.id);
    }


    useEffect(() => {
        // {room : JSON.stringify(room)}
        socket.on('room-update', (room: IRoom) => {
            setRoom(room);
            setIsCreator(room.owner === socket.id);
            console.log('room-update', room);
        });

        socket.on('start-game-success', (id) => {
            navigate(`/game/game/${id}`);
        });

        if(params.id) {
            socket.emit('room-info', params.id);
            console.log('room-info');
        }

    }, [params.id]);

    return (
        <div className="waiting-room">
            <h2 className="waiting-room-subtitle">Attente d'autres joueurs
                <span className="dots"></span></h2>
            <p className="game-code">Code de la partie : {params?.id ?? 'xxxx'}</p>
            <div className="player-list">
                <h3>Joueurs :</h3>
                <ul>
                    {room && room.players.map((player, index) => (
                        <li key={index}>{player}</li>
                    ))}
                </ul>
            </div>
            {isCreator && (
                <button className="start-game-button" onClick={handleStartGame}>
                    Lancer la partie
                </button>
            )}
        </div>
    );

}

export { WaitingRoom };
