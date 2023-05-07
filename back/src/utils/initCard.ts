import {Card} from "../class/card";
import {ECardType} from "../interface/enum";

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
            type: ECardType.TREASURE,
            value: v,
            count: 1,
        });
    });

    // SPLITER
    [1, 2, 3, 4, 5, 5, 7, 7, 9, 11, 11, 13, 14, 15, 17].forEach((v) => {
        config.push({
            type: ECardType.RESOURCE,
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

    return cards;
}

export {initCard_shuffle}
