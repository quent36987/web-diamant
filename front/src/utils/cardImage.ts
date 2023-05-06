import { ICard } from '../interface/interface';
import { ECardType } from '../interface/enum';

import serpentPng from '../assets/serpent.png';
import araigneePng from '../assets/araigne.png';
import pikePng from '../assets/pike.png';
import cavePng from '../assets/cave.png';
import firePng from '../assets/fire.png';
import eboulementPng from '../assets/eboulement.png';
import puitsPng from '../assets/puits.png';
import minePng from '../assets/mine_diamants.png';
import diamantPng from '../assets/diamant.png';

function getCaveImage() {
    return cavePng;
}

function getDiamantImage() {
    return diamantPng;
}

function getImage(card: ICard) {
    switch (card.type) {
        case ECardType.DANGER:
            return getDangerImage(card.value);
        case ECardType.SPLITER:
            return minePng;
        case ECardType.FIRSTAID:
            return puitsPng;
        default:
            return cavePng;
    }
}

function getDangerImage(value: number) {
    switch (value) {
        case 1:
            return serpentPng;
        case 2:
            return araigneePng;
        case 3:
            return pikePng;
        case 4:
            return firePng;
        case 5:
            return eboulementPng;
    }
}

export { getImage, getDangerImage, getCaveImage, getDiamantImage };
