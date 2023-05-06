export enum EAction {
    STAY = "stay",
    LEAVE = "leave",
    NONE = "none",
}

export class Player {
    username: string;
    socketId: string;

    money: number;

    newMoney: null | number;
    tempMoney: number;

    action: EAction;
    isInHome: boolean;

    constructor(username: string, socketId: string) {
        this.username = username;
        this.socketId = socketId;

        this.money = 0;
        this.newMoney = null;
        this.tempMoney = 0;

        this.action = EAction.LEAVE;
        this.isInHome = false;
    }

    setAction(action: EAction) {
        if (this.isInHome)
            return;

        this.action = action;
    }

    addMoney(money: number) {
        this.money += money;
        this.newMoney = money;
    }

    setAddMoneyNull() {
        this.newMoney = null;
    }

    quitHome() {
        this.isInHome = false;
    }

    returnHome() {
        this.isInHome = true;
    }

    copy() {
        return {
            username: this.username,
            money: this.money,
            action: this.action,
            isInHome: this.isInHome,
        }
    }


}
