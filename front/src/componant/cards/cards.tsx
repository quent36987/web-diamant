import React from 'react';
import { getCaveImage, getDiamantImage, getImage } from '../../utils/cardImage';
import { ICard } from '../../interface/interface';
import './card.css';
import { ECardType } from '../../interface/enum';

interface IProps {
    cards: ICard[];
    initialCard?: boolean;
}

const Cards = ({ cards, initialCard = false } : IProps) : JSX.Element => {

    return ( <>
        {initialCard && <div className="new-card" key={`card-init`}>
            <img src={getCaveImage()} alt="cave" className="card-image" />
        </div>}

        {cards.map((card, i) => (
            <div className="new-card" key={`card-${i}`}>

                <img src={getImage(card)} alt="cave" className="card-image" />

                {card.type !== ECardType.DANGER && ( <>
                <div className="card-number-top-right">
                    {card.value}
                </div>
                <div className="card-number-bottom-left">
                    {card.value}
                </div>
                <div className="card-number-center">
                    {card.valueLeft > 0 ? `${card.valueLeft}💎` : ""}
                </div>
                    </>)}
            </div>
            ))}
</>);
};

export  {Cards};
