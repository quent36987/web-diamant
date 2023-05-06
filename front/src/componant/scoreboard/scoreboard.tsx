import React from 'react';
import './scoreboard.css';
import { IGame } from '../../interface/interface';
import { useTimeout } from '../../utils/useTimeout';
import { RoundType } from '../../interface/enum';

interface IProps {
    game: IGame;
    close: Function;
}

const ScoreboardPopup = ({ game, close }: IProps) => {
    let delay = 5000;

    if (game.roundType === RoundType.FINISH) delay = 15000;

    useTimeout(close, delay);

    const players = game.players.sort((a, b) => b.money - a.money);

    return (
        <div className="scoreboard-popup">
            <div className="scoreboard-popup-content">
                <h2 className="scoreboard-subtitle">Tableau des scores</h2>
                <h4 className="scoreboard-subtitle">{game.caveCount}/5 caves</h4>
                <div className="player-list">
                    {players.map((player, index) => (
                        <div key={index} className="player-row">
                            <span className="flex-1">{player.username}</span>
                            <span className="">{player.money}💎</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export { ScoreboardPopup };
