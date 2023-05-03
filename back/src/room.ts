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
        // id is a random digicode with 4 digits
        this.id = "0000";
        this.setRandomId();
    }

    setRandomId() {
        this.id = Math.floor(Math.random() * 10000).toString();
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
            owner:  this.owner.socket.id,
            id: this.id,
        };
    }

}
