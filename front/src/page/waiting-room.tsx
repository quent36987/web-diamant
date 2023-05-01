
// see people in the room
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppState } from '../componant/Context';

interface IUser {
    username: string;
}

interface IRoom {
    players: IUser[];
    owner: IUser;
    id: string;
}

function WaitingRoom(){
    const [room, setRoom] = useState<IRoom>(null);
    const {socket} = AppState();
    const navigate = useNavigate();
    const params = useParams();

    const handleStartGame = () => {
        socket.emit('start-game', params.id);
    }


    useEffect(() => {
        // {room : JSON.stringify(room)}
        socket.on('room-update', (room: IRoom) => {
            setRoom(room);
            console.log('room-update', room);
        });

        socket.on('start-game-success', (id) => {
            navigate(`/game/${id}`);
        });

        if(params.id) {
            socket.emit('room-info', params.id);
            console.log('room-info');
        }

    }, [params.id]);

    return (
        <div>
            <h1>Waiting Room</h1>
            <h2>Room: {room?.id}</h2>
            <h2>Owner: {room?.owner.username}</h2>
            <h2>Players:</h2>
            <ul>
                {room?.players.map((player, index) => {
                    return <li key={index}>{player.username}
                    </li>
                })}
            </ul>
            <button onClick={handleStartGame}>Start Game</button>
        </div>
    );

}

export { WaitingRoom };
