import { IGame } from '../../interface/interface';
import './scoreboard.css';

interface IScoreboard {
    username: string;
    money: number;
    diff?: number;
}

function Scoreboard(game : IGame, oldGame : IGame | null) {
    const scoreboard: IScoreboard[] = [];
    let someoneLeave = false;

    game.players.forEach((p) => {
        const oldPlayer = oldGame?.players.find((oldP) => oldP.socketId === p.socketId);
        const diff = oldPlayer ? p.money - oldPlayer.money : 0;

        const just_leave = oldPlayer && !oldPlayer.isInHome && p.isInHome;

        someoneLeave = someoneLeave || just_leave;

        scoreboard.push({
            username: p.username,
            money: p.money,
            diff: just_leave ? diff : null
        });
    });

    scoreboard.sort((a, b) => b.money - a.money);

    console.log('scoreboard', scoreboard);

    return (
        <div className="scoreboard-body">
            {scoreboard.map((p,i) => (
                <div key={`score-${i}`} className="scoreboard-body-item">
                    <div className="scoreboard-body-item-title-1">{p.username}</div>
                    <div className="scoreboard-body-item-title-2">{p.money}</div>
                    {someoneLeave && <div className="scoreboard-body-item-title-3">{p.diff ? `(+${p.diff})` : " "}</div>}
                </div>
            ))}
        </div>
    );
}

export { Scoreboard };
