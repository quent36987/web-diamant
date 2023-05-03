import React from 'react';
import './gamePage.css';
import { Countdown } from '../componant/countdown/countdown';
import { ICard, IPlayer } from '../interface/interface';
import { EAction, RoundType } from '../interface/enum';
import { Cards } from '../componant/cards/cards';

interface IProps {
    timer: number;
    launch: boolean;
    diamonds: number;
    players: IPlayer[];
    cards: ICard[];
    handleAction: (EAction) => void;
    typeRound: RoundType;
    tempMoney: number;
}

const GamePage = ({ timer,launch, diamonds, players, cards, handleAction, typeRound, tempMoney  }: IProps) => {

    const message = (): string | null =>
    {
        switch (typeRound) {
            case RoundType.FINISH:
                return "Fin de la partie";
            case RoundType.START:
                return "Début de la partie";
            case RoundType.END_LEAVE:
                return "Tous les joueurs sont rentrés";
            case RoundType.END_DANGER:
                return "Tous les joueurs ont péris";
            default:
                return null;
        }
    }

    const diff = (player :IPlayer): string =>
    {
        if(player.newMoney !== null)
            return `+${player.newMoney} 💎`;
        if(player.isInHome)
            return " ";
        return `${tempMoney} ⛏️`;
    }

    return (
        <div className="game-page">
        <header className="game-header">
        <span className="timer">
            <Countdown count={timer} launch={launch} />
        </span>
            <span className="diamonds">
        {diamonds} 💎
        </span>
        </header>
        <div className="player-list">
            {players.map((player, index) => (
                    <div key={index} className="player-row">
                <span className="flex-2">{player.username}</span>
                <span className="flex-1">{player.isInHome ? "🏠" : "🚶"}</span>
                        <span className="player-row-diamont">{diff(player)}</span>
                    </div>
            ))}
        </div>

    <div className="game-board">
        <Cards cards={cards} />
    </div>

            <div className="flex-1 game-board-padding" />

    <footer className="game-footer">
        {message() !== null ?
            <div className="game-footer-message">{message()}</div> : <>
        <button className="stay-button" onClick={() => handleAction(EAction.STAY)}>Rester</button>
        <button className="leave-button"
                onClick={() => handleAction(EAction.LEAVE)}
        >
            Partir</button></>
        }
        </footer>
        </div>
);
};

    export default GamePage;
