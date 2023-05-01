import {EAction, Player} from "./players";
import {IUser} from "./user";
import {Card, ECardType} from "./card";
import {Server} from "socket.io";

function initCard_shuffle(): Card[]{
    const cards : Card[] = [];
    const config = [
        {
            type: ECardType.DANGER,
            value: 1,
            count: 3
        },
        {
            type: ECardType.DANGER,
            value: 2,
            count: 3
        },
        {
            type: ECardType.SPLITER,
            value: 10,
            count: 3,
        },
        {
            type: ECardType.SPLITER,
            value: 7,
            count: 3,
        },
        {
            type: ECardType.FIRSTAID,
            value: 10,
            count: 3,
        },
        {
            type: ECardType.FIRSTAID,
            value: 7,
            count: 3,
        }
    ];

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
    END = "end",
}

export const ROUND_DURATION = {
    [RoundType.START]: 15,
    [RoundType.CARD]: 10,
    [RoundType.END]: 15,
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
            this.roundType = RoundType.END;
            this.putAllPlayerInHome();

            return true;
        }

        newCards.splitMoney(this.getPlayerInGame.length);

        if (newCards.type == ECardType.DANGER &&  this.cardsInGame.find((c) => c.type === newCards.type && c.value === newCards.value)){
            this.cardsInGame.push(newCards);
            this.roundType = RoundType.END;
            this.putAllPlayerInHome();

            return true;
        }

        this.cardsInGame.push(newCards);
        return false;
    }

    get copy() {
        return {
            id: this.id,
            players: this.players,
            cardsInGame: this.cardsInGame,
            roundType: this.roundType,
            nextRoundStart: this.nextRoundStart,
            caveCount: this.caveCount,
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


    const timout = setTimeout(() => {

        switch (game.roundType) {
            case RoundType.START:
                playStart(game);
                break;
            case RoundType.CARD:
                playCard(game);
                break;
            case RoundType.END:
                if(playEnd(game))
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
        game.roundType = RoundType.END;
    }
    else
    {
        game.setNewCard();
    }
}

function playEnd(game: Game): boolean{
    if(game.caveCount === 3)
    {
        // TODO: end game
        console.log("end game")
        return true;
    }

    game.caveCount++;
    game.roundType = RoundType.START;
    game.putAllPlayerOutHome();

    game.cardsInGame = [];
    game.initRound();

    return false;
}
