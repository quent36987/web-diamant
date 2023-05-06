export enum ECardType {
    DANGER = "danger",
    SPLITER = "spliter",
    FIRSTAID = "firstaid",
}

export class Card {
    id: number;
    type: ECardType;
    value: number

    valuePerPlayer: number;
    valueLeft: number;

    constructor(id: number, type: ECardType, value: number = 0) {
        this.id = id;
        this.type = type;
        this.value = value;

        this.valuePerPlayer = 0;
        this.valueLeft = 0;
    }

    splitMoney(nbPlayers: number) {
        if (this.type === ECardType.SPLITER) {
            this.valuePerPlayer = Math.floor(this.value / nbPlayers);
            this.valueLeft = this.value - (this.valuePerPlayer * nbPlayers);
        }
        if(this.type === ECardType.FIRSTAID) {
            this.valuePerPlayer = 0;
            this.valueLeft = this.value;
        }
    }

    public getMoneyPerPlayer(nbPlayers: number): number {
        if (this.type === ECardType.SPLITER) {
            const perPLayer =  this.valuePerPlayer;
            const left = Math.floor(this.valueLeft / nbPlayers);

            this.valueLeft -= left * nbPlayers;

            return perPLayer + left
        }

        if (this.type === ECardType.FIRSTAID && nbPlayers === 1) {
            const left = this.valueLeft;
            this.valueLeft = 0;
            return left;
        }

        return 0;
    }


}
