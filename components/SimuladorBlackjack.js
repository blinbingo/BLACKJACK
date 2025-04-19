
import { useState } from 'react';

const cartas = [
  '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', '10H', 'JH', 'QH', 'KH', 'AH',
  '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', '10D', 'JD', 'QD', 'KD', 'AD',
  '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', '10S', 'JS', 'QS', 'KS', 'AS',
  '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', '10C', 'JC', 'QC', 'KC', 'AC',
];

const valores = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6,
  '7': 7, '8': 8, '9': 9, '10': 10,
  'J': 10, 'Q': 10, 'K': 10, 'A': 11,
};

function calcularValor(mao) {
  let total = 0;
  let ases = 0;

  for (let carta of mao) {
    const rank = carta.slice(0, -1);
    total += valores[rank];
    if (rank === 'A') ases++;
  }

  while (total > 21 && ases > 0) {
    total -= 10;
    ases--;
  }

  return total;
}

export default function SimuladorBlackjack() {
  const [deck, setDeck] = useState([...cartas].sort(() => 0.5 - Math.random()));
  const [jogador, setJogador] = useState([]);
  const [dealer, setDealer] = useState([]);
  const [mensagem, setMensagem] = useState("Clique em Jogar para iniciar");
  const [fim, setFim] = useState(false);

  const distribuir = () => {
    const novoDeck = [...cartas].sort(() => 0.5 - Math.random());
    const novaMaoJogador = [novoDeck.pop(), novoDeck.pop()];
    const novaMaoDealer = [novoDeck.pop(), novoDeck.pop()];
    setDeck(novoDeck);
    setJogador(novaMaoJogador);
    setDealer(novaMaoDealer);
    setMensagem("Sua vez!");
    setFim(false);
  };

  const pedirCarta = () => {
    if (fim) return;
    const novaCarta = deck.pop();
    const novaMao = [...jogador, novaCarta];
    setJogador(novaMao);
    setDeck([...deck]);
    const valor = calcularValor(novaMao);
    if (valor > 21) {
      setMensagem("Você estourou! 💥");
      setFim(true);
    }
  };

  const parar = () => {
    let novaMaoDealer = [...dealer];
    let novoDeck = [...deck];
    while (calcularValor(novaMaoDealer) < 17) {
      novaMaoDealer.push(novoDeck.pop());
    }

    setDealer(novaMaoDealer);
    setDeck(novoDeck);

    const valorJogador = calcularValor(jogador);
    const valorDealer = calcularValor(novaMaoDealer);

    if (valorDealer > 21 || valorJogador > valorDealer) {
      setMensagem("Você venceu! 🎉");
    } else if (valorJogador < valorDealer) {
      setMensagem("Dealer venceu! 😞");
    } else {
      setMensagem("Empate! 🤝");
    }

    setFim(true);
  };

  return (
    <div className="mesa">
      <h1>Blackjack do Blindado</h1>
      <p>{mensagem}</p>

      <div className="dealer">
        <h2>Dealer</h2>
        <div className="cartas">
          {dealer.map((carta, i) => (
            <img key={i} src={`/cards/${carta}.png`} alt={carta} />
          ))}
        </div>
      </div>

      <div className="jogador">
        <h2>Você</h2>
        <div className="cartas">
          {jogador.map((carta, i) => (
            <img key={i} src={`/cards/${carta}.png`} alt={carta} />
          ))}
        </div>
      </div>

      <div className="buttons" style={{ marginTop: 20 }}>
        {!fim && jogador.length > 0 && (
          <>
            <button onClick={pedirCarta}>Pedir carta</button>
            <button onClick={parar}>Parar</button>
          </>
        )}
        {(fim || jogador.length === 0) && (
          <button onClick={distribuir}>Jogar</button>
        )}
      </div>
    </div>
  );
}
