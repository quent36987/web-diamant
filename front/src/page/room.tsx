
// Create Room or Join Room
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppState } from '../componant/Context';

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
            navigate(`/waiting-room/${id}`);
        });
    });

    return (
        <div>
            <h1>Set your room</h1>
            <input type="text" value={room} onChange={handleRoomChange} />
            <button onClick={handleJoinRoom}>Join Room</button>
            <button onClick={handleCreateRoom}>Create Room</button>
        </div>
    );
}

export { Room };
