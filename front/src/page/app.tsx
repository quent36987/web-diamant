import React, { useState, useEffect } from 'react';
import { AppState } from '../componant/Context';
import {  useParams } from 'react-router-dom';
import './game.css'
import { ICard, IGame, IPlayer } from '../interface/interface';
import { EAction, ECardType, RoundType } from '../interface/enum';
import GamePage from './gamePage';
import { emit } from '../utils/socket';
import { ScoreboardPopup } from '../componant/scoreboard/scoreboard';

function Game() {
    const [game, setGame] = useState<IGame>(null);
    const [clock, setClock] = useState(0);
    const [launchClock, setLaunchClock] = useState(false);
    const [player, setPlayer] = useState<IPlayer>(null);
    const [showScoreboard, setShowScoreboard] = useState(false);

    const {socket} = AppState();
    const params = useParams();

    const handleAction = (action: EAction) => {
        emit(socket, 'game-action', params.id, action);
    }

    const closeScoreboard = () => {
        setShowScoreboard(false);
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

        }, [game]);

    useEffect(() => {
        if (game == null)
            return;

        if (game.roundType === RoundType.START && game.caveCount > 0) {
            setShowScoreboard(true);
        }

    }, [game?.roundType]);


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
        <div onClick={closeScoreboard} className="height-100">
       <GamePage
           timer={clock}
           launch={launchClock}
           player={player ?? null}
           players={game?.players ?? []}
           cards={game?.cardsInGame ?? []}
           handleAction={handleAction}
           typeRound={game?.roundType ?? RoundType.START}
           tempMoney={game?.tempMoney ?? 0}
       />

        {showScoreboard && (
            <ScoreboardPopup game={game} close={closeScoreboard}/>
        )}
        </div>
    );
}

export default Game;
