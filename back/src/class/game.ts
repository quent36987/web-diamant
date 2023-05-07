import {Player} from "./players";
import {Card} from "./card";
import {Server} from "socket.io";
import {EAction, ECardType, RoundType} from "../interface/enum";
import {initCard_shuffle} from "../utils/initCard";
import {ROUND_DURATION} from "../interface/constant";
import {IUser} from "../interface/interface";


export class Game {
    private readonly _io: Server;
    private _id: string;
    players: Player[];
    cards: Card[];
    cardsInGame: Card[];
    roundType: RoundType;
    nextRoundStart: Date;
    caveCount: number;
    isPlaying = false;
    timer: NodeJS.Timeout | null = null;

    constructor(id: string, users: IUser[], io: Server) {
        this._io = io;
        this._id = id;

        this.players = users.map((u) => new Player(u.socket?.username ?? '?', u.socket.id));

        this.cardsInGame = [];
        this.cards = [];

        this.roundType = RoundType.START;
        this.nextRoundStart = new Date();
        this.caveCount = 0;
        this.timer = null;
        this.isPlaying = false;

        this.initRound();
        this.playGame();
    }

    get id() {
        return this._id;
    }

    set id(id: string) {
        this._id = id;
    }

    get io() {
        return this._io;
    }

    initRound() {
        this.cards = initCard_shuffle();
        this.cardsInGame = [];
    }

    getPlayer(socketId: string) {
        return this.players.find((p) => p.socketId === socketId);
    }

    removePlayer(socketId: string) {
        this.players = this.players.filter((p) => p.socketId !== socketId);
    }

    setPlayerAction(socketId: string, action: EAction) {
        const player = this.getPlayer(socketId);

        if (player) {
            player.setAction(action);
        }

        // find a player who is not in home and has not played yet
        const playerNotInHome = this.players.find((p) => !p.isInHome && p.action == EAction.NONE);
        if (!playerNotInHome) {
            this.startNextRound();
        }
    }

    getPlayerLeave(){
        return this.players.filter((p) => p.action !== EAction.STAY && !p.isInHome);
    }

    get getPlayerInGame(){
        return this.players.filter((p) => !p.isInHome);
    }

    putAllPlayerInHome(){
        this.players.forEach((p) => p.returnHome());
    }

    putAllPlayerOutHome(){
        this.players.forEach((p) => p.quitHome());
    }

    public setNewCard() : boolean {
        const newCards = this.cards.pop();

        if (!newCards)
        {
            this.roundType = RoundType.FINISH;
            this.putAllPlayerInHome();

            return true;
        }

        newCards.initCardValue(this.getPlayerInGame.length);

        if (newCards.type == ECardType.DANGER &&
            this.cardsInGame.find((c) => c.type === newCards.type &&
            c.value === newCards.value)){

            this.cardsInGame.push(newCards);
            this.roundType = RoundType.END_DANGER;
            this.putAllPlayerInHome();

            return true;
        }

        this.cardsInGame.push(newCards);
        return false;
    }

    get copy() {
        // add tempMoney
        const tempMoney = this.cardsInGame.reduce((acc, c) => acc + c.valuePerPlayer, 0);

        return {
            id: this.id,
            players: this.players.map((p) => p.copy),
            cardsInGame: this.cardsInGame.map((c) => c.copy),
            roundType: this.roundType,
            nextRoundStart: this.nextRoundStart,
            caveCount: this.caveCount,
            tempMoney,
        }
    }

    playGame(){
        this.isPlaying = true;
        const date = new Date();
        const duration = ROUND_DURATION[this.roundType];
        const newDate = new Date(date.getTime() + duration * 1000);
        this.nextRoundStart = newDate;

        this.players.forEach((p) => {
            p.setAction(EAction.NONE);
        });

        // FIXME: send juste good information to client
        this.io.to(this.id).emit("game-update", this.copy);

        this.players.forEach((p) => {
            p.setAddMoneyNull();
        });

        this.timer = setTimeout(() => {
            this.startNextRound();
        }, newDate.getTime() - date.getTime());

        this.isPlaying = false;
    }

    startNextRound() {
        if (this.isPlaying)
            return;

        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }

        switch (this.roundType) {
            case RoundType.START:
                this.playStart();
                break;
            case RoundType.CARD:
                this.playCard();
                break;
            case RoundType.END_DANGER:
            case RoundType.END_LEAVE:
                this.playEnd()
                break;
            case RoundType.FINISH:
                return;
        }

        this.playGame();
    }

    playStart(){
        this.roundType = RoundType.CARD;
        this.setNewCard();
    }

    playCard(){
        const playerWhoLeave = this.getPlayerLeave();

        playerWhoLeave.forEach((p) => {

            let count = 0;
            this.cardsInGame.forEach((c) => {
                count += c.getMoneyPerPlayer(playerWhoLeave.length);
            });

            p.addMoney(count);

            p.returnHome();
        });

        if(this.getPlayerInGame.length == 0)
        {
            this.roundType = RoundType.END_LEAVE;
        }
        else
        {
            this.setNewCard();
        }
    }

    playEnd(): boolean{
        if(this.caveCount === 5)
        {
            this.roundType = RoundType.FINISH;
            return true;
        }

        this.caveCount++;
        this.roundType = RoundType.START;
        this.putAllPlayerOutHome();

        this.cardsInGame = [];
        this.initRound();

        return false;
    }
}

