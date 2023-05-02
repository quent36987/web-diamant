
// Home page to set the username
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppState } from '../componant/Context';

function Home() {
    const [username, setUsername] = useState('');
    const {socket, setUser} = AppState();
    const navigate = useNavigate();

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    }

    const handleUsernameSubmit = () => {
        console.log(username);
        socket.emit('set-username', username);
    }

    useEffect(() => {
        if(socket == null) {
            console.log('socket is null');
            return;
        }

        socket.on('set-username-success', () => {
            console.log('Set username successfully!');
            setUser(username);
            navigate('/room');
        });

    }, [socket]);

    return (
        <div>
            <h1>Set your username</h1>
            <input type="text" value={username} onChange={handleUsernameChange} />
            <button onClick={handleUsernameSubmit}>Submit</button>
        </div>
    );
}

export { Home };
