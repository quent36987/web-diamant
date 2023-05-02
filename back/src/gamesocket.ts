import {CustomSocket} from "./index";
import {Server} from "socket.io";
import {Game} from "./game";
import {EAction} from "./players";


export default (io: Server, socket: CustomSocket, game : Game) => {
    console.log("User connected game", socket.id);

    socket.on("game-info", (gameId) => {
        console.log(`${socket.username} has requested info for game ${gameId}`);

        // const game = games.find((g) => g.id === gameId);

        if (game) {
            socket.emit('game-update', game.copy);
        }
    });

    socket.on("game-action", (gameId : string, action : EAction) => {
        console.log(`${socket.username} has requested action for game ${gameId}`);

        // console.log('games', games.length,gameId)
       // const game = games.find((g) => g.id === gameId);

        if (game) {
            console.log('action', action, socket.id)
            game.setPlayerAction(socket.id, action);
        }
    });

};