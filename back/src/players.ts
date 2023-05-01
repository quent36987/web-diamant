export enum EAction {
    STAY = "stay",
    LEAVE = "leave",
}

export class Player {
    username: string;
    socketId: string;

    money: number;

    action: EAction;
    isInHome: boolean;

    constructor(username: string, socketId: string) {
        this.username = username;
        this.socketId = socketId;

        this.money = 0;

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
    }

    quitHome() {
        this.isInHome = false;
    }

    returnHome() {
        this.isInHome = true;
    }


}
