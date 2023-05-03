import { IGame } from '../../interface/interface';
import './scoreboard.css';

interface IScoreboard {
    username: string;
    money: number;
    diff?: number;
}

function Scoreboard(game : IGame, oldGame : IGame | null) {
    const scoreboard: IScoreboard[] = [];

    game.players?.forEach((p) => {
        const oldPlayer = oldGame?.players.find((oldP) => oldP.socketId === p.socketId);
        const diff = oldPlayer ? p.money - oldPlayer.money : 0;
        scoreboard.push({
            username: p.username,
            money: p.money,
            diff: diff ? diff : undefined
        });
    });

    scoreboard.sort((a, b) => b.money - a.money);

    return (
        <div className="scoreboard-body">
            {scoreboard.map((p,i) => (
                <div key={`score-${i}`} className="scoreboard-body-item">
                    <div className="scoreboard-body-item-title-1">{p.username}</div>
                    <div className="scoreboard-body-item-title-2">{p.money}</div>
                    {p.diff && <div className="scoreboard-body-item-title-3">(+{p.diff})</div>}
                </div>
            ))}
        </div>
    );
}

export { Scoreboard };
