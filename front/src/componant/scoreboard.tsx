import { IGame } from '../interface/interface';


interface IScoreboard {
    username: string;
    money: number;
    diff?: number;
}

function Scoreboard(game : IGame, oldGame : IGame | null) {
    const scoreboard: IScoreboard[] = [];

    game.players.forEach((p) => {
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
            {/*<div className="scoreboard-body-item">*/}
            {/*    <div className="scoreboard-body-item-title">Joueur</div>*/}
            {/*    <div className="scoreboard-body-item-title">Score</div>*/}
            {/*</div>*/}
            {scoreboard.map((p,i) => (
                <div key={`score-${i}`} className="scoreboard-body-item">
                    <div className="scoreboard-body-item-title">{p.username}</div>
                    <div className="scoreboard-body-item-title">{p.money}</div>
                    {p.diff && <div className="scoreboard-body-item-title">(+{p.diff})</div>}
                </div>
            ))}
        </div>
    );
}

export { Scoreboard };
