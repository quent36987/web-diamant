import React, { useState, useEffect } from 'react';
import { AppState } from '../componant/Context';
import { useNavigate, useParams } from 'react-router-dom';
import './game.css'
import { Countdown } from '../componant/countdown/countdown';
import cavePng from '../assets/cave.png';
import araigneePng from '../assets/araigne.png';
import pikePng from '../assets/pike.png';
import serpentPng from '../assets/serpent.png';


enum EAction {
    STAY = "stay",
    LEAVE = "leave",
}

enum RoundType {
    START = "start",
    CARD = "card",
    END = "end",
}

enum ECardType {
    DANGER = "danger",
    SPLITER = "spliter",
    FIRSTAID = "firstaid",
}

interface ICard {
    id: number;
    type: ECardType;
    value: number

    valuePerPlayer: number;
    valueLeft: number;
}

interface IPlayer {
    username: string;
    socketId: string;

    money: number;

    action: EAction;
    isInHome: boolean;
}

interface IGame {
    players: IPlayer[];
    id: string;
    cardsInGame: ICard[];
    roundType: RoundType;
    nextRoundStart: Date;
    caveCount: number;
}

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
    const [clock, setClock] = useState(10);
    const [playerInGame, setPlayerInGame] = useState(0);
    const [player, setPlayer] = useState<IPlayer>(null);
    const [tempMoney, setTempMoney] = useState(0);

    const {socket} = AppState();
    const navigate = useNavigate();
    const params = useParams();

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

        socket.on('game-update', (game: IGame) => {
            console.log('game-update', game);
            setGame(game)

            const now = new Date();
            const nextRoundStart = new Date(game.nextRoundStart);
            const diff = nextRoundStart.getTime() - now.getTime();
            const seconds = Math.floor(diff / 1000);
            setClock(seconds)

            setPlayer(game.players.find((player) => player.socketId === socket.id));

            setPlayerInGame(game.players.filter((player) => !player.isInHome).length);

            setTempMoney(temMoney(game));

            console.log('clock', clock,seconds);
        });

        if(params.id) {
            socket.emit('game-info', params.id);
            console.log('game-info');
        }

    }, [params.id]);

    return (
        <div className="flex-col game-page">

            <div className="header">
                {Countdown(clock)}
                <div>💎 {player?.money ?? 0}</div>
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
