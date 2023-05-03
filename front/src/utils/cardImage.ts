import { ICard } from '../interface/interface';
import { ECardType } from '../interface/enum';

import serpentPng from '../assets/serpent.png';
import araigneePng from '../assets/araigne.png';
import pikePng from '../assets/pike.png';
import cavePng from '../assets/cave.png';
import pierrePng from '../assets/pierre.png';
import lavePng from '../assets/lave.png';
import plitPng from '../assets/plit.png';
import puiePng from '../assets/puie.png';

function getImage(card: ICard) {
    switch (card.type) {
        case ECardType.DANGER:
            switch (card.value) {
                case 1:
                    return serpentPng;
                case 2:
                    return araigneePng;
                case 3:
                    return pikePng;
                case 4:
                    return  lavePng;
                case 5:
                    return pierrePng;
            }
            break;
        case ECardType.SPLITER:
            return plitPng;
        case ECardType.FIRSTAID:
            return puiePng;
        default:
            return cavePng;
    }
}

export { getImage}
