import React, { useState, useEffect, useRef } from 'react';
import { AppState } from '../componant/Context';
import { useNavigate, useParams } from 'react-router-dom';
import './game.css'
import { Countdown } from '../componant/countdown/countdown';
import cavePng from '../assets/cave.png';
import { ICard, IGame, IPlayer } from '../interface/interface';
import { EAction, ECardType, RoundType } from '../interface/enum';
import { useToast } from '../componant/toast';
import { Scoreboard } from '../componant/scoreboard/scoreboard';
import { getImage } from '../utils/cardImage';
import GamePage from './gamePage';
import { emit } from '../utils/socket';

function Game() {
    const [game, setGame] = useState<IGame>(null);
    const [clock, setClock] = useState(0);
    const [launchClock, setLaunchClock] = useState(false);
    const [player, setPlayer] = useState<IPlayer>(null);

    const {socket} = AppState();
    const params = useParams();

    const handleAction = (action: EAction) => {
        emit(socket, 'game-action', params.id, action);
    }

    useEffect(() => {
        if(game == null)
            return;

        const now = new Date();
        const nextRoundStart = new Date(game.nextRoundStart);
        const diff = nextRoundStart.getTime() - now.getTime();
        const seconds = Math.floor(diff / 1000);
        setClock(seconds);
        setLaunchClock(val => !val);

        setPlayer(game.players.find((player) => player.socketId === socket.id));

        console.log('clock', clock,seconds);

    }, [game]);


    useEffect(() => {
        if (socket === null) {
            return;
        }

        socket.on('game-update', (newGame: IGame) => {

            console.log('game-update', newGame);
            setGame(newGame);
        });

        if(params.id) {
            socket.emit('game-info', params.id);
            console.log('game-info');
        }

    }, [params.id]);


    return (
       <GamePage
           timer={clock}
           launch={launchClock}
           diamonds={player?.money ?? 0}
           players={game?.players ?? []}
           cards={game?.cardsInGame ?? []}
           handleAction={handleAction}
           typeRound={game?.roundType ?? RoundType.START}
           tempMoney={game?.tempMoney ?? 0}
       />
    );
}

export default Game;
