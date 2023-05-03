import React from 'react';
import { getImage } from '../../utils/cardImage';
import { ICard } from '../../interface/interface';
import './card.css';
import { ECardType } from '../../interface/enum';

interface IProps {
    cards: ICard[];
}

const Cards = ({ cards } : IProps) : JSX.Element => {

    return ( <>
        {cards.map((card, index) => (
            <div className="new-card">

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
