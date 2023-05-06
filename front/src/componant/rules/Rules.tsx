import React, { useEffect, useState } from 'react';
import SwipeableViews from 'react-swipeable-views-react-18-fix';
import './rules.css';
import { EAction, ECardType } from '../../interface/enum';
import { Cards } from '../cards/cards';
import { getDangerImage, getDiamantImage } from '../../utils/cardImage';
import { ICard, IPlayer } from '../../interface/interface';

const Rule1 = () => (
    <div className="rulesPageContainer">
        <div className="rule-content">
            <p>
            Vous êtes un<br/>
                <mark className="highlighted"> explorateur</mark> !
            </p><br/>
            <p>
            Votre but est de <span className="highlighted">récupérer</span> plus de diamants que les autres explorateurs !
        </p> </div>
    </div>
)


const Rule2 = () => (
    <div className="rulesPageContainer">
         <div className="diamonds-rule2">
          45
             <div className="diamonds-header">
                 <img src={getDiamantImage()} alt="cave" width={25}/>
             </div>
        </div>

        <div className="rule-content">
            Le total <br/>de vos diamants<br/> récupérés<br/> se trouve ici
        </div>
    </div>
)

const Rule3 = () => (
    <div className="rulesPageContainer">
        <div className="rule-content">
            Vous allez<br/>
            participer à
            <span className="highlighted"> cinq explorations </span>
            <br/>
            afin<br/>
            <br/>
            de récolter un <br/>
            maximum de diamants.
        </div>
    </div>
)

const Rule4 = () => (
    <div className="rulesPageContainer">
        <div className="button-rule4">
            <button className="stay-button"> Rester</button>
            <button className="leave-button">Partir</button>
        </div>

        <div className="rule-content">
        <p>
            A chaque étapes (cartes),
            vous choisirez entre <span className="highlighted">rester</span> en exploration ou <span className="highlighted">partir</span> pour retourner au camp.

        </p>
        </div>
    </div>
)

const Rule5 = () => (
    <div className="rulesPageContainer">
        <div className="rule-content">
            <div className="">
                Les 5 cartes danger
            </div>

        <div className="image-danger-rule5">
            <img src={getDangerImage(1)} alt="cave" width="30%"/>
            <img src={getDangerImage(2)} alt="cave" width="30%"/>
            <img src={getDangerImage(3)} alt="cave" width="30%"/>
            <img src={getDangerImage(4)} alt="cave" width="30%"/>
            <img src={getDangerImage(5)} alt="cave" width="30%"/>
        </div>

            <div className="">
               Votre total de diamants se trouve en haut a droite
            </div>
        </div>
    </div>
)

const CARDS_RULES_6 : ICard[] =  [{
    id: 1,
    value: 2,
    valueLeft: 2,
    valuePerPlayer: 1,
    type: ECardType.FIRSTAID,
},
    {
        id: 1,
        value: 6,
        valueLeft: 6,
        valuePerPlayer: 1,
        type: ECardType.FIRSTAID,
    }
]

const Rule6 = () => (
    <div className="rulesPageContainer">
        <div className="rule-content">
            <div className="">
                Votre total de diamants se trouve en haut a droite
            </div>

            <div className="wrapper-rules6">
                <div className="image-rule6">
                    <Cards cards={CARDS_RULES_6}  />
                </div>
            </div>

            <div className="">
                Votre total de diamants se trouve en haut a droite
            </div>
        </div>
    </div>
)

const CARDS_RULES_7 : ICard[] =  [{
        id: 1,
        value: 3,
        valueLeft: 1,
        valuePerPlayer: 1,
        type: ECardType.SPLITER,
    },
    {
        id: 1,
        value: 6,
        valueLeft: 0,
        valuePerPlayer: 1,
        type: ECardType.SPLITER,
    }
    ]

const Rule7 = () => (
    <div className="rulesPageContainer">
        <div className="rule-content">
            <div className="">
                Votre total de diamants se trouve en haut a droite
            </div>

            <div className="wrapper-rules6">
                <div className="image-rule6">
                    <Cards cards={CARDS_RULES_7}  />
                </div>
            </div>

            <div className="">
                Votre total de diamants se trouve en haut a droite
            </div>
        </div>
    </div>
)

const Rule7Bis = () => (
    <div className="rulesPageContainer">
        <div className="rule-content">
            <div className="">
                Votre total de diamants se trouve en haut a droite
            </div>

            <div className="wrapper-rules6">
                <div className="image-rule6">
                    <Cards cards={CARDS_RULES_7}  />
                </div>
            </div>

            <div className="">
                Votre total de diamants se trouve en haut a droite
            </div>
        </div>
    </div>
)

const Rule8 = () => (
    <div className="rulesPageContainer">
        <div className="rule-content">

            <div className="wrapper-rules8">
                <div className="player-list">
                        <div className="player-row">
                            <span className="flex-2">joueur 1</span>
                            <span className="flex-1">🏠</span>
                            <span className="player-row-diamont"> </span>
                        </div>
                    <div className="player-row">
                        <span className="flex-2">joueur 2</span>
                        <span className="flex-1">🚶</span>
                        <span className="player-row-diamont"> 14⛏️</span>
                    </div>
                    <div className="player-row">
                        <span className="flex-2">joueur 3</span>
                        <span className="flex-1">🏠</span>
                        <span className="player-row-diamont">(+21💎)</span>
                    </div>
                </div>
            </div>

            <div className="">
                Votre total de diamants se trouve en haut a droite
            </div>
        </div>
    </div>
)

const RulePage = ({ text }) => (
        <div className="rulesPageContainer">
            <div className="rule-content">
                {text}
            </div>
        </div>
);

const RulesCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const rulePages = [
        <Rule1 />,
        <Rule2 />,
        <Rule3 />,
        <Rule4 />,
        <RulePage text="Il existe trois types de cartes" />,
        <Rule5 />,
        <Rule6 />,
        <Rule7 />,
        <Rule7Bis />,
        <Rule8 />,
        <RulePage text="Règle 2" />,
    ];



    return (
        <SwipeableViews
            className="rules-carousel"

        >
            {rulePages}

        </SwipeableViews>
    );
};

export { RulesCarousel };
