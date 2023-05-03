import {EAction, Player} from "./players";
import {IUser} from "./user";
import {Card, ECardType} from "./card";
import {Server} from "socket.io";

function initCard_shuffle(): Card[]{
    const cards : Card[] = [];
    // 15 DANGER cards [1,1,1,2,2,2,3,3,3,4,4,4,5,5,5]
    // 5 FIRSTAID cards [5,7,8,10,12]
    // 15 SPLITER cards [1-5,5,7,7,9,11,11,13-15,17]

    const config = [];

    // DANGER
    for (let i = 1; i <= 5; i++) {
        config.push({
            type: ECardType.DANGER,
            value: i,
            count: 3,
        });
    }

    // FIRSTAID
    [5, 7, 8, 10, 12].forEach((v) => {
        config.push({
            type: ECardType.FIRSTAID,
            value: v,
            count: 1,
        });
    });

    // SPLITER
    [1, 2, 3, 4, 5, 5, 7, 7, 9, 11, 11, 13, 14, 15, 17].forEach((v) => {
        config.push({
            type: ECardType.SPLITER,
            value: v,
            count: 1,
        });
    });

    config.forEach((c) => {
        for (let i = 0; i < c.count; i++) {
            cards.push(new Card(i, c.type, c.value));
        }
    });

    //shuffle
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp : Card = cards[i];
        cards[i] = cards[j];
        cards[j] = tmp;
    }

    //console.log(cards);

    return cards;
}

export enum RoundType {
    START = "start",
    CARD = "card",
    END_LEAVE = "end-leave",
    END_DANGER = "end-danger",
    FINISH = "end",
}

export const ROUND_DURATION = {
    [RoundType.START]: 5,
    [RoundType.CARD]: 10,
    [RoundType.FINISH]: 10,
    [RoundType.END_LEAVE]: 7,
    [RoundType.END_DANGER]: 7,
}

export class Game {
    players: Player[];
    id: string;
    cards: Card[];
    cardsInGame: Card[];
    roundType: RoundType;
    nextRoundStart: Date;
    caveCount: number;

    constructor(id: string, users: IUser[], io: Server) {
        this.id = id;

        this.players = users.map((u) => new Player(u.socket?.username ?? 'ano', u.socket.id));

        this.cardsInGame = [];
        this.cards = [];

        this.roundType = RoundType.START;
        this.nextRoundStart = new Date();
        this.caveCount = 0;

        this.initRound();
        playGame(this,io)
    }

    initRound() {
        this.cards = initCard_shuffle();
        this.cardsInGame = [];
    }

    getPlayer(socketId: string) {
        return this.players.find((p) => p.socketId === socketId);
    }

    setPlayerAction(socketId: string, action: EAction) {
        const player = this.getPlayer(socketId);
        if (player) {
            player.setAction(action);
        }
    }

    getPlayerLeave(){
        return this.players.filter((p) => p.action === EAction.LEAVE && p.isInHome == false);
    }

    get getPlayerInGame(){
        return this.players.filter((p) => p.isInHome == false);
    }

    putAllPlayerInHome(){
        this.players.forEach((p) => p.isInHome = true);
    }

    putAllPlayerOutHome(){
        this.players.forEach((p) => p.isInHome = false);
    }

    public setNewCard() : boolean {
        const newCards = this.cards.pop();

        if (!newCards)
        {
            this.roundType = RoundType.FINISH;
            this.putAllPlayerInHome();

            return true;
        }

        newCards.splitMoney(this.getPlayerInGame.length);

        if (newCards.type == ECardType.DANGER &&  this.cardsInGame.find((c) => c.type === newCards.type && c.value === newCards.value)){
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
            players: this.players,
            cardsInGame: this.cardsInGame,
            roundType: this.roundType,
            nextRoundStart: this.nextRoundStart,
            caveCount: this.caveCount,
            tempMoney,
        }
    }





}

function playGame(game: Game,io: Server){
    const date = new Date();

    const duration = ROUND_DURATION[game.roundType];

    const newDate = new Date(date.getTime() + duration * 1000);

    console.log("next round at", newDate.toISOString(),date.toISOString());

    game.nextRoundStart = newDate;

    // FIXME: send juste good information to client
    io.to(game.id).emit("game-update", game.copy);

    game.players.forEach((p) => {
        p.setAddMoneyNull();
    });

    const timout = setTimeout(() => {

        switch (game.roundType) {
            case RoundType.START:
                playStart(game);
                break;
            case RoundType.CARD:
                playCard(game);
                break;
            case RoundType.FINISH:
            case RoundType.END_DANGER:
                case RoundType.END_LEAVE:
                if (playEnd(game))
                    return;
                break;
        }

        playGame(game,io);

    }, newDate.getTime() - date.getTime());
}

function playStart(game: Game){
    game.roundType = RoundType.CARD;
    game.setNewCard();
}

function playCard(game: Game){
    const playerWhoLeave = game.getPlayerLeave();

    playerWhoLeave.forEach((p) => {

        let count = 0;
        game.cardsInGame.forEach((c) => {
            count += c.getMoneyPerPlayer(playerWhoLeave.length);
        });

        p.addMoney(count);

        p.returnHome();
    });

    if(game.getPlayerInGame.length == 0)
    {
        game.roundType = RoundType.END_LEAVE;
    }
    else
    {
        game.setNewCard();
    }
}

function playEnd(game: Game): boolean{
    if(game.caveCount === 3)
    {
        game.roundType = RoundType.FINISH;
        return true;
    }

    game.caveCount++;
    game.roundType = RoundType.START;
    game.putAllPlayerOutHome();

    game.cardsInGame = [];
    game.initRound();

    return false;
}
