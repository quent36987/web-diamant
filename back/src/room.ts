import {IUser} from "./user";

export interface IUserCompact {
    username: string;
}

export interface IRoomCompact {
    players: IUserCompact[];
    owner: IUserCompact;
    id: string;
}

export class Room {
    players: IUser[];
    owner: IUser;
    id: string;

    constructor(owner: IUser) {
        this.players = [owner];
        this.owner = owner;
        this.id = Math.random().toString(36).substring(7);
    }

    setRandomId() {
        this.id = Math.random().toString(36).substring(7);
    }

    addPlayer(player: IUser) {
        this.players.push(player);
    }

    removePlayer(player: IUser) {
        this.players = this.players.filter((p) => p.socket.id !== player.socket.id);
    }

    getPlayers() {
        return this.players;
    }

    getPlayersCount() {
            return this.players.length;
    }

    getId() {
        return this.id;
    }

    getCompact() {
        return {
            players: this.players.map((p) => ( p.socket.username)),
            owner:  this.owner.socket.username,
            id: this.id,
        };
    }

}
