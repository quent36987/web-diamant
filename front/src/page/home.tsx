// Home page to set the username
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppState } from '../componant/Context';
import { emit } from '../utils/socket';
import { useToast } from '../componant/toast';
import { ECardType } from '../interface/enum';
import './home.css';
import GamePage from './gamePage';
import { ICard } from '../interface/interface';

function Home() {
    const [username, setUsername] = useState('');
    const {socket, setUser} = AppState();
    const navigate = useNavigate();
    const toast = useToast();

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setUsername(event.target.value);
    }

    const handleUsernameSubmit = () : void => {
        // toast.open({
        //     titre: 'Des joueur ont quitté la partie',
        //     component: Scoreboard({
        //         "id": "p8g36i",
        //         "players": [
        //             {
        //                 "username": "oui",
        //                 "socketId": "SWnLdyM7Muxc_Z-wAAAB",
        //                 "money": 0,
        //                 "action": EAction.LEAVE,
        //                 "isInHome": false
        //             },
        //             {
        //                 "username": "oui",
        //                 "socketId": "SWnLdyM7Muxc_Z-wAAAB",
        //                 "money": 4,
        //                 "action": EAction.LEAVE,
        //                 "isInHome": true
        //             },
        //             {
        //                 "username": "oui",
        //                 "socketId": "SWnLdyM7Muxc_Z-wAAAB",
        //                 "money": 2,
        //                 "action": EAction.LEAVE,
        //                 "isInHome": true
        //             }
        //         ],
        //         "cardsInGame": [
        //         ],
        //         "roundType": RoundType.FINISH,
        //         "nextRoundStart": new Date(),
        //         "caveCount": 0
        //     },{
        //         "id": "p8g36i",
        //         "players": [
        //             {
        //                 "username": "oui",
        //                 "socketId": "SWnLdyM7Muxc_Z-wAAAB",
        //                 "money": 0,
        //                 "action": EAction.LEAVE,
        //                 "isInHome": false
        //             },
        //             {
        //                 "username": "oui",
        //                 "socketId": "SWnLdyM7Muxc_Z-wAAAB",
        //                 "money": 2,
        //                 "action": EAction.LEAVE,
        //                 "isInHome": false
        //             },
        //             {
        //                 "username": "oui",
        //                 "socketId": "SWnLdyM7Muxc_Z-wAAAB",
        //                 "money": 2,
        //                 "action": EAction.LEAVE,
        //                 "isInHome": false
        //             }
        //         ],
        //         "cardsInGame": [
        //         ],
        //         "roundType": RoundType.FINISH,
        //         "nextRoundStart": new Date(),
        //         "caveCount": 0
        //     })
        // })

        emit(socket,'set-username', username);
    }

    useEffect(() => {
        if(socket == null) {
            return;
        }

        socket.on('set-username-success', ():void => {
            setUser(username);
            navigate('/game/room');
        });

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
