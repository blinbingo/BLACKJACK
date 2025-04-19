
import { useState } from 'react';


export default function Home() {
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [deck, setDeck] = useState([]);
  const [message, setMessage] = useState('Clique em "Jogar" para começar!');
  const [gameOver, setGameOver] = useState(false);

  const cards = [
    { name: '2', value: 2 },
    { name: '3', value: 3 },
    { name: '4', value: 4 },
    { name: '5', value: 5 },
    { name: '6', value: 6 },
    { name: '7', value: 7 },
    { name: '8', value: 8 },
    { name: '9', value: 9 },
    { name: '10', value: 10 },
    { name: 'J', value: 10 },
    { name: 'Q', value: 10 },
    { name: 'K', value: 10 },
    { name: 'A', value: 11 },
  ];

  const shuffleDeck = () => {
    let newDeck = [];
    const suits = ['♠', '♥', '♦', '♣'];
    for (let suit of suits) {
      for (let card of cards) {
        newDeck.push({ ...card, suit });
      }
    }
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    return newDeck;
  };

  const dealCard = (deck) => {
    const card = deck[0];
    return [card, deck.slice(1)];
  };

  const calculateValue = (hand) => {
    let value = hand.reduce((acc, card) => acc + card.value, 0);
    let aces = hand.filter(c => c.name === 'A').length;
    while (value > 21 && aces) {
      value -= 10;
      aces--;
    }
    return value;
  };

  const startGame = () => {
    const newDeck = shuffleDeck();
    let [playerCard1, remaining1] = dealCard(newDeck);
    let [dealerCard1, remaining2] = dealCard(remaining1);
    let [playerCard2, remaining3] = dealCard(remaining2);
    let [dealerCard2, remaining4] = dealCard(remaining3);

    setPlayerHand([playerCard1, playerCard2]);
    setDealerHand([dealerCard1, dealerCard2]);
    setDeck(remaining4);
    setMessage('Sua vez!');
    setGameOver(false);
  };

  const hit = () => {
    let [newCard, remainingDeck] = dealCard(deck);
    const newHand = [...playerHand, newCard];
    setPlayerHand(newHand);
    setDeck(remainingDeck);

    const total = calculateValue(newHand);
    if (total > 21) {
      setMessage('Estourou! Você perdeu.');
      setGameOver(true);
    }
  };

  const stay = () => {
    let currentDeck = [...deck];
    let newDealerHand = [...dealerHand];

    while (calculateValue(newDealerHand) < 17) {
      let [newCard, remainingDeck] = dealCard(currentDeck);
      newDealerHand.push(newCard);
      currentDeck = remainingDeck;
    }

    setDealerHand(newDealerHand);
    const playerTotal = calculateValue(playerHand);
    const dealerTotal = calculateValue(newDealerHand);

    if (dealerTotal > 21 || playerTotal > dealerTotal) {
      setMessage('Você venceu!');
    } else if (playerTotal < dealerTotal) {
      setMessage('Dealer venceu!');
    } else {
      setMessage('Empate!');
    }
    setGameOver(true);
  };

  return (
    <div className="container">
      <h1>Blackjack do Blindado</h1>
      <p className="message">{message}</p>

      <div className="hands">
        <div>
          <h2>Jogador</h2>
          <p>{playerHand.map(c => `${c.name}${c.suit}`).join(' ')}</p>
        </div>
        <div>
          <h2>Dealer</h2>
          <p>{dealerHand.map(c => `${c.name}${c.suit}`).join(' ')}</p>
        </div>
      </div>

      {!gameOver && playerHand.length > 0 && (
        <div className="buttons">
          <button onClick={hit}>Pedir carta</button>
          <button onClick={stay}>Parar</button>
        </div>
      )}

      {(gameOver || playerHand.length === 0) && (
        <button onClick={startGame}>Jogar</button>
      )}
    </div>
  );
}
