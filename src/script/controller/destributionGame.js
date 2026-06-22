import { createDeck } from "./deckGame.js";
import { Ia } from "../model/ia.js";

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
}

export function dealCards() {

    const deck = shuffleDeck(createDeck());

    const iaDeck = deck.slice(0, 3);
    const playerDeck = deck.slice(3, 6);

    const ia = new Ia(iaDeck);

    localStorage.setItem("playerObj", JSON.stringify({
    points: 0,
    roundWins: 0,
    deck: playerDeck
    }));

    localStorage.setItem("iaObj", JSON.stringify({
        points: 0,
        roundWins: 0,
        deck: iaDeck
    }));

    localStorage.setItem("statusGame",JSON.stringify({
        round:0
    }));
    const cardScores = {
    '4♣️': 15,
    '7❤️': 14,
    'A♠️': 13,
    '7♦️': 12,


    '3♠️': 11,
    '3♦️': 11,
    '3❤️': 11,
    '3♣️': 11,

    '2♠️': 10,
    '2♦️': 10,
    '2❤️': 10,
    '2♣️': 10,

    'A♦️': 9,
    'A❤️': 9,
    'A♣️': 9,

    'K♠️': 7,
    'K♦️': 7,
    'K❤️': 7,
    'K♣️': 7,

    'J♠️': 6,
    'J♦️': 6,
    'J❤️': 6,
    'J♣️': 6,

    'Q♠️': 5,
    'Q♦️': 5,
    'Q❤️': 5,
    'Q♣️': 5
    };

    localStorage.setItem("scoresCards", JSON.stringify(cardScores));

    return { iaDeck, playerDeck };
}