import express from 'express';
import http from "http";
import session from 'express-session';
import { Server, Socket } from "socket.io";
import {Room} from "./room";

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

const io = new Server(server, {
    cors: {
        origin : '*'
    }
});

const rooms: Room[] = [];

io.on('connection', (socket : CustomSocket) => {
    console.log('User connected');
    socket.username = 'Anonymous';

    socket.on('set-username', (username) => {
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
        socket.join(room.getId());
        socket.emit('join-room-success', room.getId());
        console.log(`${socket.username} has joined room ${room.getId()}`);
    });

    socket.on('join-room', (roomId : string) => {
        console.log(`${socket.username} has joined room ${roomId}`);

        const room = rooms.find((r) => r.getId() === roomId);

        if (room) {
            room.addPlayer({socket});
            socket.join(room.getId());
            socket.emit('join-room-success', room.getId());
            socket.to(room.getId()).emit('room-update', room.getCompact());
            console.log(`${socket.username} has joined room ${room.getId()}`);
        }
        else {
            console.log(`${socket.username} has failed to join room ${roomId}`)
        }
    });

    socket.on('room-info', (roomId) => {
        console.log(`${socket.username} has requested info for room ${roomId}`);

        const room = rooms.find((r) => r.getId() === roomId);

        if (room) {
            socket.emit('room-update', room.getCompact());
            console.log(`${socket.username} has joined room ${room.getId()}`);
        }
    });

    socket.on('start-game', (roomId) => {
        console.log(`${socket.username} has started game in room ${roomId}`);

        const room = rooms.find((r) => r.getId() === roomId);

        if (room && room.owner.socket.id === socket.id) {
            io.to(room.getId()).emit('start-game-success');
            console.log(`${socket.username} has started game in room ${room.getId()}`);
        }
    });




    socket.on('disconnect', () => {
        console.log(`${socket.username} has left the server`);

        const room = rooms.find((r) => r.owner.socket.id === socket.id);

        if (room) {
            room.removePlayer({socket});
            socket.to(room.getId()).emit('room-update', room.getCompact());
            console.log(`${socket.username} has left room ${room.getId()}`);
        }
    });
});

server.listen(3005, () => {
    console.log("Server listening on port 3005");
});
