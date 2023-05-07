import {IUser} from "../interface/interface";

export class Room {
    private _users: IUser[];
    private _owner: IUser;
    private _id: string;

    constructor(owner: IUser) {
        this._users = [owner];
        this._owner = owner;
        this._id = "0000";
        this.setRandomId();
    }

    setRandomId() {
        this._id = Math.floor(Math.random() * 10000).toString();
    }

    addPlayer(player: IUser) {
        this._users.push(player);
    }

    removePlayer(player: IUser) {
        this._users = this._users.filter((p) => p.socket.id !== player.socket.id);
    }

    get users() {
        return this._users;
    }

    get owner() {
        return this._owner;
    }

    get playersCount() {
            return this._users.length;
    }

    get id() {
        return this._id;
    }

    getCompact() {
        return {
            players: this._users.map((p) => ( p.socket.username)),
            owner:  this._owner.socket.id,
            id: this.id,
        };
    }

}
