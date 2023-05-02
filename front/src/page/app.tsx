import React, { useState, useEffect } from 'react';
import { AppState } from '../componant/Context';
import { useNavigate, useParams } from 'react-router-dom';
import './game.css'
import { Countdown } from '../componant/countdown/countdown';
import cavePng from '../assets/cave.png';
import araigneePng from '../assets/araigne.png';
import pikePng from '../assets/pike.png';
import serpentPng from '../assets/serpent.png';
import { ICard, IGame, IPlayer } from '../interface/interface';
import { EAction, ECardType } from '../interface/enum';
import { useToast } from '../componant/toast';
import { Scoreboard } from '../componant/scoreboard';



// TODO: utils/cardImage.ts
function getImage(card: ICard) {
    switch (card.type) {
        case ECardType.DANGER:
            switch (card.value) {
                case 1:
                    return serpentPng;
                case 2:
                    return araigneePng;
                case 3:
                    return pikePng;
            }
            break;
        case ECardType.SPLITER:
            return cavePng;
        case ECardType.FIRSTAID:
            return cavePng;
        default:
            return cavePng;
    }
}



function Game() {
    const [game, setGame] = useState<IGame>(null);
    const [clock, setClock] = useState(0);
    const [playerInGame, setPlayerInGame] = useState(0);
    const [player, setPlayer] = useState<IPlayer>(null);
    const [tempMoney, setTempMoney] = useState(0);

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
        if (socket === null) {
            return;
        }

        socket.on('game-update', (newGame: IGame) => {

            // get type and change actio => :)

            console.log('game-update', newGame);
            setGame(newGame)

            const now = new Date();
            const nextRoundStart = new Date(newGame.nextRoundStart);
            const diff = nextRoundStart.getTime() - now.getTime();
            const seconds = Math.floor(diff / 1000);
            setClock(seconds)

            setPlayer(newGame.players.find((player) => player.socketId === socket.id));

            setPlayerInGame(newGame.players.filter((player) => !player.isInHome).length);

            setTempMoney(temMoney(newGame));

            console.log('clock', clock,seconds);
        });

        if(params.id) {
            socket.emit('game-info', params.id);
            console.log('game-info');
        }

    }, [params.id]);

    const openScoreboard = (titre: string,oldGame : IGame | null = null) => {
        toast.open({
            titre,
            component: Scoreboard(game,oldGame)
        });
    }

    return (
        <div className="flex-col game-page">

            <div className="header">
                <Countdown count={clock} />
                <div onClick={() => openScoreboard('Scoreboard')}>💎 {player?.money ?? 0}</div>
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

            <div className="game">
                {game && game.cardsInGame.map((card,i) => { return (
                    <div className="card" key={`card-${i}`}>
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
