import express from 'express';
import http from "http";
import session from 'express-session';
import { Server, Socket } from "socket.io";
import {Room} from "./class/room";
import listenGame from "./gamesocket";
import {Game} from "./class/game";
//cors
import cors from 'cors';

export interface CustomSocket extends Socket {
    username?: string;
}

const app = express();
const server = http.createServer(app);

app.use(session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}));

app.use(cors());

const io = new Server(server, {
    cors: {
        origin : '*'
    }
});

const rooms: Room[] = [];
const games: Game[] = [];

io.on('connection', (socket : CustomSocket) => {
    console.log('User connected');
    socket.username = 'Anonymous';

    socket.on('set-username', (username : string) => {
        socket.username = username;
        console.log(`${socket.username} has joined the server`);

        socket.emit('set-username-success' );
    });

    socket.on('create-room', () => {
        console.log(`${socket.username} has created a room`);

        const room = new Room({
            socket: socket,
        });

        rooms.push(room);
        socket.join(room.id);
        socket.emit('join-room-success', room.id);
        console.log(`${socket.username} has joined room ${room.id}`);
    });

    socket.on('join-room', (roomId : string) => {
        console.log(`${socket.username} has joined room ${roomId}`);

        const room = rooms.find((r) => r.id === roomId);

        if (room) {
            room.addPlayer({socket});
            socket.join(room.id);
            socket.emit('join-room-success', room.id);
            socket.to(room.id).emit('room-update', room.getCompact());
            console.log(`${socket.username} has joined room ${room.id}`);
        }
        else {
            console.log(`${socket.username} has failed to join room ${roomId}`)
        }
    });

    socket.on('room-info', (roomId) => {
        console.log(`${socket.username} has requested info for room ${roomId}`);

        const room = rooms.find((r) => r.id === roomId);

        if (room) {
            socket.emit('room-update', room.getCompact());
        }
    });

    socket.on('start-game', (roomId) => {
        console.log(`${socket.username} has started game in room ${roomId}`);

        const room = rooms.find((r) => r.id === roomId);

        if (room && room.owner.socket.id === socket.id) {
            console.log(`${socket.username} has started game in room ${room.id}`);

            const game = new Game(room.id, room.users, io);

            //if game already exists, change it
            while(games.findIndex((g) => g.id === game.id) !== -1) {
                game.id = Math.floor(Math.random() * 1000000).toString();
            }

            games.push(game);

            io.to(room.id).emit('start-game-success', game.id);

            room.users.forEach((user) => {
                listenGame(io, user.socket, game);
                user.socket.leave(room.id);
                user.socket.join(game.id);
            });

        }
    });

    socket.on('disconnect', () => {
        console.log(`${socket.username} has left the server`);

        const player_rooms = rooms.filter((r) => r.users.find((p) => p.socket.id === socket.id));

        player_rooms.forEach((room) => {
            room.removePlayer({socket});
            socket.to(room.id).emit('room-update', room.getCompact());
            console.log(`${socket.username} has left room ${room.id}`);
        });

        const player_games = games.filter((g) => g.players.find((p) => p.socketId === socket.id));

        player_games.forEach((game) => {
            game.removePlayer(socket.id);
            console.log(`${socket.username} has left game ${game.id}`);
        });

        // suprimer les rooms vides
        rooms.forEach((room) => {
            if (room.playersCount === 0) {
                rooms.splice(rooms.indexOf(room), 1);
            }
        });

        // supprimer les games vides
        games.forEach((game) => {
            if (game.players.length === 0) {
                games.splice(games.indexOf(game), 1);
            }
        });
    });
});

server.listen(3005, () => {
    console.log("Server listening on port 3005");
});
