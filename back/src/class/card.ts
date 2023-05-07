import {ECardType} from "../interface/enum";

export class Card {
    private readonly _id: number;
    private readonly _type: ECardType;
    private readonly _value: number;

    private _valuePerPlayer: number;
    private _valueLeft: number;

    constructor(id: number, type: ECardType, value: number = 0) {
        this._id = id;
        this._type = type;
        this._value = value;

        this._valuePerPlayer = 0;
        this._valueLeft = 0;
    }

    get type() {
        return this._type;
    }

    get value() {
        return this._value;
    }

    get valuePerPlayer() {
        return this._valuePerPlayer;
    }

    initCardValue(nbPlayers: number) {
        if (this._type === ECardType.RESOURCE) {
            this._valuePerPlayer = Math.floor(this._value / nbPlayers);
            this._valueLeft = this._value - (this._valuePerPlayer * nbPlayers);
        }

        if(this._type === ECardType.TREASURE) {
            this._valuePerPlayer = 0;
            this._valueLeft = this._value;
        }
    }

    public getMoneyPerPlayer(nbPlayers: number): number {
        if (this._type === ECardType.RESOURCE) {
            const perPLayer =  this._valuePerPlayer;
            const left = Math.floor(this._valueLeft / nbPlayers);

            this._valueLeft -= left * nbPlayers;

            return perPLayer + left
        }

        if (this._type === ECardType.TREASURE && nbPlayers === 1) {
            const left = this._valueLeft;
            this._valueLeft = 0;

            return left;
        }

        return 0;
    }

    get copy(){
        return {
            id: this._id,
            type: this._type,
            value: this._value,
            valuePerPlayer: this._valuePerPlayer,
            valueLeft: this._valueLeft,
        }
    }
}
