import {EAction} from "../interface/enum";

export class Player {
    private readonly _username: string;
    private readonly _socketId: string;

    private _money: number;
    private _newMoney: null | number;

    private _action: EAction;
    private _isInHome: boolean;

    constructor(username: string, socketId: string) {
        this._username = username;
        this._socketId = socketId;

        this._money = 0;
        this._newMoney = null;

        this._action = EAction.LEAVE;
        this._isInHome = false;
    }

    get socketId() {
        return this._socketId;
    }

    get username() {
        return this._username;
    }

    get money() {
        return this._money;
    }

    get action() {
        return this._action;
    }

    get isInHome() {
        return this._isInHome;
    }

    setAction(action: EAction) {
        if (this._isInHome)
            return;

        this._action = action;
    }

    addMoney(money: number) {
        this._money += money;
        this._newMoney = money;
    }

    setAddMoneyNull() {
        this._newMoney = null;
    }

    quitHome() {
        this._isInHome = false;
    }

    returnHome() {
        this._isInHome = true;
    }

    get copy() {
        return {
            username: this._username,
            money: this._money,
            isInHome: this._isInHome,
            newMoney: this._newMoney,
            socketId: this._socketId,
        }
    }
}
