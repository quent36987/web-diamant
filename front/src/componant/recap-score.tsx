import { IGame } from '../interface/interface';

function Scoreboard(game : IGame) {
    // const playersSorded = game.players.sort((a, b) => {
    //     return b.money - a.money;
    // });

    return (
        <div className="scoreboard-body">
            <div className="scoreboard-body-item">
                <div className="scoreboard-body-item-title">Joueur</div>
                <div className="scoreboard-body-item-title">Score</div>
            </div>
            {game.players.map((p,i) => (
                <div key={`score-${i}`} className="scoreboard-body-item">
                    <div className="scoreboard-body-item-title">{p.username}</div>
                    <div className="scoreboard-body-item-title">{p.money}</div>
                </div>
            ))}
        </div>
    );
}

export { Scoreboard };
