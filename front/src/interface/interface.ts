import { EAction, ECardType, RoundType } from './enum';

export interface ICard {
    id: number;
    type: ECardType;
    value: number;

    valuePerPlayer: number;
    valueLeft: number;
}

export interface IPlayer {
    username: string;
    socketId: string;

    newMoney: number | null;
    money: number;

    action: EAction;
    isInHome: boolean;
}

export interface IGame {
    players: IPlayer[];
    id: string;
    cardsInGame: ICard[];
    roundType: RoundType;
    nextRoundStart: Date;
    caveCount: number;
    tempMoney: number;
}
