export enum ECardType {
    DANGER = 0,
    SPLITER = 1,
    FIRSTAID = 2,
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
    }

    splitMoney(nbPlayers: number) {
        if (this.type === ECardType.SPLITER) {
            // divide by nbPlayers (eclidiane division)
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
            // divide by nbPlayers (eclidiane division)
            const perPLayer =  this.valuePerPlayer;
            const left = Math.floor(this.valueLeft / nbPlayers);

            this.valueLeft -= left * nbPlayers;

            return perPLayer + left
        }

        if (this.type === ECardType.FIRSTAID && nbPlayers === 0) {
            this.valueLeft = 0;
            return this.value;
        }

        return 0;
    }


}
