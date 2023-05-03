import { ICard } from '../interface/interface';
import { ECardType } from '../interface/enum';
import serpentPng from '../assets/serpent.png';
import araigneePng from '../assets/araigne.png';
import pikePng from '../assets/pike.png';
import cavePng from '../assets/cave.png';

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
            }
            break;
        case ECardType.SPLITER:
            return cavePng;
        case ECardType.FIRSTAID:
            return cavePng;
        default:
            return cavePng;
    }
}

export { getImage}
