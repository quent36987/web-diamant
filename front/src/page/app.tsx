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

function Game() {
    const [game, setGame] = useState<IGame>(null);
    const [oldGame, setOldGame] = useState<IGame>(null);
    const [clock, setClock] = useState(0);
    const [launchClock, setLaunchClock] = useState(false);
    const [playerInGame, setPlayerInGame] = useState(0);
    const [player, setPlayer] = useState<IPlayer>(null);
    const [tempMoney, setTempMoney] = useState(0);
    const listeRef = useRef(null);

    const {socket} = AppState();
    const navigate = useNavigate();
    const params = useParams();
    const toast = useToast();

    const handleAction = (action: EAction) => {
        console.log('game-action', action);
        socket.emit('game-action', params.id, action);
    }

    function temMoney(game): number {
        let count = 0;

        game.cardsInGame.forEach((c) => {
            count += c.valuePerPlayer;
        });

        return count;
    }

    useEffect(() => {
        if(game == null)
            return;

        const newPlayerInGame = game.players.filter((player) => !player.isInHome).length;

        switch (game.roundType) {
            case RoundType.START:
                break;
            case RoundType.FINISH:
                openScoreboard('Fin de la partie !',game,oldGame);
                break;
            case RoundType.CARD:
                if(playerInGame !== newPlayerInGame) {
                    openScoreboard('Un ou des joueurs ont quitté la partie !',game,oldGame);
                }
                break;
            case RoundType.END_DANGER:
                setTimeout(() => openScoreboard('Danger',game,oldGame), 2000);
                break;
            case RoundType.END_LEAVE:
                openScoreboard('Les joueurs ont quitté la partie !',game,oldGame);
                break;
            default:
                break;
        }

        const now = new Date();
        const nextRoundStart = new Date(game.nextRoundStart);
        const diff = nextRoundStart.getTime() - now.getTime();
        const seconds = Math.floor(diff / 1000);
        setClock(seconds);
        setLaunchClock(val => !val);

        setPlayer(game.players.find((player) => player.socketId === socket.id));

        setPlayerInGame(newPlayerInGame);

        setTempMoney(temMoney(game));

        console.log('clock', clock,seconds);

        if(listeRef)
            listeRef.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

    }, [game]);


    useEffect(() => {
        if (socket === null) {
            return;
        }

        socket.on('game-update', (newGame: IGame) => {

            console.log('game-update', newGame);
            setGame(game => {
                if (game === null) {
                    return newGame;
                }

                setOldGame(game);
                return newGame;
            });
        });

        if(params.id) {
            socket.emit('game-info', params.id);
            console.log('game-info');
        }

    }, [params.id]);

    const openScoreboard = (titre: string, game:IGame, oldGame : IGame | null = null) => {
        toast.open({
            titre,
            component: Scoreboard(game,oldGame)
        });
    }

    return (
        <div className="flex-col game-page">

            <div className="header">
                <Countdown count={clock} launch={launchClock} />
                <div onClick={() => openScoreboard('Scoreboard',game)}>💎 {player?.money ?? 0}</div>
            </div>

            <div className="card">
                <div className="game-body-image">
                    <img  src={cavePng} alt="cave" height="100%" width="100%" />
                </div>
                <div className="game-body-info">
                    <div className="game-body-info-1">Buttin provisoire : {tempMoney} 💎</div>
                    <div className="game-body-info-1">En expédition : {playerInGame} 👨‍👩‍👧‍👦</div>
                </div>
            </div>

            <div className="game" ref={listeRef}>
                {game && game.cardsInGame.map((card,i) => { return (
                    <div className="card" key={`card-${i}`} ref={i === game.cardsInGame.length - 1 ? listeRef : null}>
                        <div className="game-body-image">
                            <img  src={getImage(card)} alt="cave" height="100%" width="100%" />
                        </div>
                        <div className="game-body-info">
                            {card.type === ECardType.DANGER ? <div className="game-body-info-1">☠️</div> : <>
                            <div className="game-body-info-1">{card.valueLeft} 💎</div>
                            <div className="game-body-info-1">({card.valuePerPlayer}💎/ personne)</div></>}
                        </div>
                    </div>
                )
                })}
            </div>

            <div className="footer">
                {player?.isInHome ? <div>N'est plus en expédition</div> :
                    <>
                        <div className="submit-button" onClick={() => handleAction(EAction.STAY)}>Stay</div>
                        <div className="submit-button" onClick={() => handleAction(EAction.LEAVE)}>Leave</div>
                    </>
                }
            </div>
        </div>
    );
}

export default Game;
