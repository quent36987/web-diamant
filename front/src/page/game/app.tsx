import GamePage from './gamePage';
import React, { useState, useEffect } from 'react';
import { IGame, IPlayer } from '../../interface/interface';
import { AppState } from '../../componant/Context';
import { EAction, RoundType } from '../../interface/enum';
import { ScoreboardPopup } from '../../componant/scoreboard/scoreboard';
import { emit } from '../../utils/socket';
import { path } from '../../constant/router';
import { useNavigate, useParams } from 'react-router-dom';
import { debugLog } from '../../utils/logger';

function Game() {
    const [game, setGame] = useState<IGame>(null);
    const [clock, setClock] = useState(0);
    const [launchClock, setLaunchClock] = useState(false);
    const [player, setPlayer] = useState<IPlayer>(null);
    const [showScoreboard, setShowScoreboard] = useState(false);

    const { socket } = AppState();
    const params = useParams();
    const nagivate = useNavigate();

    const handleAction = (action: EAction) => {
        emit(socket, 'game-action', params.id, action);
    };

    const closeScoreboard = () => {
        setShowScoreboard(false);
    };

    useEffect(() => {
        if (socket === null) nagivate(path.home);
    }, [socket]);

    useEffect(() => {
        if (game == null) return;

        const now = new Date();
        const nextRoundStart = new Date(game.nextRoundStart);
        const diff = nextRoundStart.getTime() - now.getTime();
        const seconds = Math.floor(diff / 1000);

        setClock(seconds);
        setLaunchClock((val) => !val);
        setPlayer(game.players.find((player) => player.socketId === socket.id));
    }, [game]);

    useEffect(() => {
        if (game == null) return;

        if ((game.roundType === RoundType.START && game.caveCount > 0) || game.roundType === RoundType.FINISH) {
            setShowScoreboard(true);
        }
    }, [game?.roundType]);

    useEffect(() => {
        if (socket === null) {
            return;
        }

        socket.on('game-update', (newGame: IGame) => {
            debugLog('game-update', newGame);
            setGame(newGame);
        });

        if (params.id) {
            emit(socket, 'game-info', params.id);
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

            {showScoreboard && <ScoreboardPopup game={game} close={closeScoreboard} />}
        </div>
    );
}

export default Game;
