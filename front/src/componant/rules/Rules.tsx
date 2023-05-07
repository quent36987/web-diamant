import React, {  useState } from 'react';
import SwipeableViews from 'react-swipeable-views-react-18-fix';
import './rules.css';
import {  ECardType } from '../../interface/enum';
import { Cards } from '../cards/cards';
import { getDangerImage, getDiamantImage } from '../../utils/cardImage';
import { ICard} from '../../interface/interface';
import { useNavigate } from 'react-router-dom';

const Rule1 = () => (
    <div className="rulesPageContainer">
        <div className="rule-content">
            <p>
                Vous êtes un
                <br />
                <mark className="highlighted"> explorateur</mark> !
            </p>
            <br />
            <p>
                Votre but est de <span className="highlighted">récupérer</span> plus de diamants que
                les autres explorateurs !
            </p>{' '}
        </div>
    </div>
);

const Rule2 = () => (
    <div className="rulesPageContainer">
        <div className="diamonds-rule2">
            45
            <div className="diamonds-header">
                <img src={getDiamantImage()} alt="cave" width={25} />
            </div>
        </div>

        <div className="rule-content">
            Le total <br />
            de vos diamants
            <br /> récupérés
            <br /> se trouve ici
        </div>
    </div>
);

const Rule3 = () => (
    <div className="rulesPageContainer">
        <div className="rule-content">
            Vous allez
            <br />
            participer à<span className="highlighted"> cinq explorations </span>

            afin
            <br />
            de récolter un <br />
            maximum de diamants.
        </div>
    </div>
);

const Rule4 = () => (
    <div className="rulesPageContainer">
        <div className="button-rule4">
            <button className="stay-button"> Rester</button>
            <button className="leave-button">Partir</button>
        </div>

        <div className="rule-content">
            <div className="rule8">

                A chaque étape (carte), vous choisirez entre{' '}
                <span className="highlighted">rester</span> en exploration ou{' '}
                <span className="highlighted">partir</span> pour retourner au camp.
                <br />
                <br />
            </div>
                <div className="rule5">
                    Lorsque vous rentrez au camp, les diamants que vous avez récupérés sont{' '}
                    <span className="highlighted">sauvegardés.</span>
                </div>

        </div>
    </div>
);

const Rule5 = () => (
    <div className="rulesPageContainer">
        <div className="rule-content">
            <div className="">Cinq cartes danger</div>

            <div className="image-danger-rule5">
                <img src={getDangerImage(1)} alt="cave" width="30%" />
                <img src={getDangerImage(2)} alt="cave" width="30%" />
                <img src={getDangerImage(3)} alt="cave" width="30%" />
                <img src={getDangerImage(4)} alt="cave" width="30%" />
                <img src={getDangerImage(5)} alt="cave" width="30%" />
            </div>

            <div className="rule5">
                Si une même carte danger est tirée <span className="highlighted">deux fois</span>,
                l'exploration se termine pour tous les joueurs.
                <br />
                Tous les diamants récupérés sont <span className="highlighted">perdus.</span>
            </div>
        </div>
    </div>
);

const CARDS_RULES_6: ICard[] = [
    {
        id: 1,
        value: 2,
        valueLeft: 2,
        valuePerPlayer: 1,
        type: ECardType.TREASURE
    },
    {
        id: 1,
        value: 6,
        valueLeft: 6,
        valuePerPlayer: 1,
        type: ECardType.TREASURE
    }
];

const Rule6 = () => (
    <div className="rulesPageContainer">
        <div className="rule-content">
            <div className="">Les cartes puits de diamants</div>

            <div className="wrapper-rules6">
                <div className="image-rule6">
                    <Cards cards={CARDS_RULES_6} />
                </div>
            </div>

            <div className="rule8">
                Le premier joueur à partir <span className="highlighted">seul</span> récupère tous
                les diamants de ces cartes.
            </div>

            <div className="rule5">
                <br />
                Si plusieurs joueurs partent en même temps les diamants restent sur les cartes.
            </div>
        </div>
    </div>
);

const CARDS_RULES_7: ICard[] = [
    {
        id: 1,
        value: 3,
        valueLeft: 1,
        valuePerPlayer: 1,
        type: ECardType.RESOURCE
    },
    {
        id: 1,
        value: 6,
        valueLeft: 0,
        valuePerPlayer: 1,
        type: ECardType.RESOURCE
    }
];

const Rule7 = () => (
    <div className="rulesPageContainer">
        <div className="rule-content">
            <div className="">Les cartes ressources</div>

            <div className="wrapper-rules6">
                <div className="image-rule6">
                    <Cards cards={CARDS_RULES_7} />
                </div>
            </div>

            <div className="rule5">
                Le nombre écrit dans les angles de la carte représente le nombre initial de
                diamants.
                <br />
                Ces diamants sont <span className="highlighted">répartis équitablement</span> entre
                les joueurs encore en exploration.
                <br />
                Le surplus est laissé sur la carte.
            </div>
        </div>
    </div>
);

const Rule7Bis = () => (
    <div className="rulesPageContainer">
        <div className="rule-content">
            <div className="">Les cartes ressources</div>

            <div className="wrapper-rules6">
                <div className="image-rule6">
                    <Cards cards={CARDS_RULES_7} />
                </div>
            </div>

            <div className="rule5">
                Lorsqu'un ou plusieurs joueurs{' '}
                <span className="highlighted">rentre(nt) au camps</span>,
                <br />
                le <span className="highlighted">surplus</span> de diamants sur ces cartes est{' '}
                <span className="highlighted">réparti</span> équitablement entre eux, si cela est
                possible.
            </div>
        </div>
    </div>
);

const Rule8 = () => (
    <div className="rulesPageContainer">
        <div className="rule-content">
            <div className="wrapper-rules8">
                <div className="player-list">
                    <div className="player-row">
                        <span className="flex-3">joueur 1</span>
                        <span className="flex-1">🏠</span>
                        <span className="player-row-diamont"> </span>
                    </div>
                    <div className="player-row">
                        <span className="flex-3">joueur 2</span>
                        <span className="flex-1">🚶</span>
                        <span className="player-row-diamont"> 14⛏️</span>
                    </div>
                    <div className="player-row">
                        <span className="flex-3">joueur 3</span>
                        <span className="flex-1">🏠</span>
                        <span className="player-row-diamont">(+21💎)</span>
                    </div>
                </div>
            </div>

            <div className="rule8">
                Pendant la partie, il est possible de savoir où se trouvent les autres joueurs.
                <br />
                <br />
                🏠: le joueur est au camp.
                <br />
                🚶: le joueur est en exploration.
            </div>
        </div>
    </div>
);

const Rule8Bis1 = () => (
    <div className="rulesPageContainer">
        <div className="rule-content">
            <div className="wrapper-rules8">
                <div className="player-list">
                    <div className="player-row">
                        <span className="flex-3">joueur 1</span>
                        <span className="flex-1">🏠</span>
                        <span className="player-row-diamont"> </span>
                    </div>
                    <div className="player-row">
                        <span className="flex-3">joueur 2</span>
                        <span className="flex-1">🚶</span>
                        <span className="player-row-diamont"> 14⛏️</span>
                    </div>
                    <div className="player-row">
                        <span className="flex-3">joueur 3</span>
                        <span className="flex-1">🏠</span>
                        <span className="player-row-diamont">(+21💎)</span>
                    </div>
                </div>
            </div>

            <div className="rule8">
                On peut savoir également le nombre de diamants récupérés par les joueurs pendant
                l'exploration. (⛏️)
            </div>

            <div className="rule5">
                <br />
                ⚠️ Ils peuvent être perdu si vous ne rentrez pas à temps.
            </div>
        </div>
    </div>
);

const Rule8Bis2 = () => (
    <div className="rulesPageContainer">
        <div className="rule-content">
            <div className="wrapper-rules8">
                <div className="player-list">
                    <div className="player-row">
                        <span className="flex-3">joueur 1</span>
                        <span className="flex-1">🏠</span>
                        <span className="player-row-diamont"> </span>
                    </div>
                    <div className="player-row">
                        <span className="flex-3">joueur 2</span>
                        <span className="flex-1">🚶</span>
                        <span className="player-row-diamont"> 14⛏️</span>
                    </div>
                    <div className="player-row">
                        <span className="flex-3">joueur 3</span>
                        <span className="flex-1">🏠</span>
                        <span className="player-row-diamont">(+21💎)</span>
                    </div>
                </div>
            </div>

            <div className="rule8">
                Lorsqu'un joueur rentre au camp, il est possible de savoir avec combien de diamants
                il est rentré. (+21💎)
            </div>
        </div>
    </div>
);

const Rule9 = () => (
    <div className="rulesPageContainer">
        <div className="rule-content">
            Pour les plus matheux, voici la composition du jeu :
            <div className="rule5">
                <br />
                - 35 cartes
                <br />- <span className="highlighted">15 cartes dangers</span> (3 par danger)
                <br />- <span className="highlighted">15 cartes ressources</span>{' '}
                (1,2,3,4,5,5,7,7,9,11,11,13,14,15,17)
                <br />- <span className="highlighted">5 cartes puits</span> (5,7,8,10,12)
                <br />
                <br />( Le jeu est mélangé avant chaque exploration )
            </div>
        </div>
    </div>
);

const Rule10 = ({ navigate }) => (
    <div className="rulesPageContainer">
        <div className="rule-content">
            Bonne chance !
            <br />
            <br />
            <button className="stay-button" onClick={() => navigate(-1)}>
                Revenir à la partie
            </button>
        </div>
    </div>
);

const RulePage = ({ text }) => (
    <div className="rulesPageContainer">
        <div className="rule-content">{text}</div>
    </div>
);

const RulesCarousel = () => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const rulePages = [
        <Rule1 />,
        <Rule2 />,
        <Rule3 />,
        <Rule4 />,
        <RulePage text="Il existe trois types de cartes." />,
        <Rule5 />,
        <Rule6 />,
        <Rule7 />,
        <Rule7Bis />,
        <Rule8 />,
        <Rule8Bis1 />,
        <Rule8Bis2 />,
        <Rule9 />,
        <Rule10 navigate={navigate} />
    ];

    return <SwipeableViews className="rules-carousel">{rulePages}</SwipeableViews>;
};

export { RulesCarousel };
