import {EAction, Player} from "./players";
import {IUser} from "./user";
import {Card, ECardType} from "./card";
import {Server} from "socket.io";

function initCard_shuffle(): Card[]{
    const cards = [];
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
        const tmp = cards[i];
        cards[i] = cards[j];
        cards[j] = tmp;
    }

    //console.log(cards);

    return cards;
}

export enum RoundType {
    START = 0,
    CARD = 1,
    RECAP = 2,
    END = 2,
}

export const ROUND_DURATION = {
    [RoundType.START]: 5,
    [RoundType.CARD]: 10,
    [RoundType.RECAP]: 5,
    [RoundType.END]: 5,
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

        this.players = users.map((u) => new Player(u.socket.username, u.socket.id));

        this.initRound();

        this.roundType = RoundType.START;
        this.caveCount = 0;

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
        newCards.splitMoney(this.getPlayerInGame.length);

        if (this.cardsInGame.find((c) => c.type === newCards.type && c.value === newCards.value)){
            this.cardsInGame.push(newCards);
            this.roundType = RoundType.END;
            this.putAllPlayerInHome();

            return true;
        }

        this.cardsInGame.push(newCards);
        return false;
    }





}
function playGame(game: Game,io: Server,){
    const time = new Date();
    const duration = ROUND_DURATION[game.roundType];

    const newDate = new Date(time.getTime() + duration * 1000);

    game.nextRoundStart = newDate;

    io.to(game.id).emit("game-update", game);


    setTimeout(() => {

        switch (game.roundType) {
            case RoundType.START:
                playStart(game)
            case RoundType.CARD:
                playCard(game)
            case RoundType.END:
                playEnd(game)
        }

        playGame(game,io);

    }, newDate.getTime() - time.getTime());
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

function playEnd(game: Game){
    if(game.caveCount === 3)
    {
        // TODO: end game
        console.log("end game")
    }

    game.caveCount++;
    game.roundType = RoundType.START;
    game.putAllPlayerOutHome();

    game.cardsInGame = [];
    game.initRound();
}
