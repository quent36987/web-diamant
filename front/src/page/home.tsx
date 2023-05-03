// Home page to set the username
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppState } from '../componant/Context';
import { emit } from '../utils/socket';
import { useToast } from '../componant/toast';
import { Scoreboard } from '../componant/scoreboard/scoreboard';
import { EAction, RoundType } from '../interface/enum';

function Home() {
    const [username, setUsername] = useState('');
    const {socket, setUser} = AppState();
    const navigate = useNavigate();
    const toast = useToast();

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setUsername(event.target.value);
    }

    const handleUsernameSubmit = () : void => {
        toast.open({
            titre: 'Scoreboard',
            component: Scoreboard({
                "id": "p8g36i",
                "players": [
                    {
                        "username": "oui",
                        "socketId": "SWnLdyM7Muxc_Z-wAAAB",
                        "money": 0,
                        "action": EAction.LEAVE,
                        "isInHome": false
                    }
                ],
                "cardsInGame": [
                ],
                "roundType": RoundType.FINISH,
                "nextRoundStart": new Date(),
                "caveCount": 0
            },null)
        })

        emit(socket,'set-username', username);
    }

    useEffect(() => {
        if(socket == null) {
            return;
        }

        socket.on('set-username-success', ():void => {
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
