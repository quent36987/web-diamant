import {CustomSocket} from "../index";

export interface IUserCompact {
    username: string;
}

export interface IRoomCompact {
    players: IUserCompact[];
    owner: IUserCompact;
    id: string;
}

export interface IUser {
    socket: CustomSocket;
}
