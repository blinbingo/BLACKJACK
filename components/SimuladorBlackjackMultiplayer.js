
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
    if (!carta) continue;
    const rank = carta.slice(0, -1);
    total += valores[rank] || 0;
    if (rank === 'A') ases++;
  }

  while (total > 21 && ases > 0) {
    total -= 10;
    ases--;
  }

  return total;
}

export default function SimuladorBlackjackMultiplayer() {
  const [deck, setDeck] = useState([]);
  const [jogadores, setJogadores] = useState([[], [], [], [], []]);
  const [dealer, setDealer] = useState([]);
  const [vez, setVez] = useState(0);
  const [mensagem, setMensagem] = useState('Clique em "Jogar" para iniciar');
  const [fim, setFim] = useState(false);
  const [resultados, setResultados] = useState([]);
  const [dealerRevelado, setDealerRevelado] = useState(false);
  const [estourados, setEstourados] = useState([false, false, false, false, false]);

  const distribuir = () => {
    const novoDeck = [...cartas].sort(() => 0.5 - Math.random());
    const novasMaos = [[], [], [], [], []];
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 5; j++) {
        novasMaos[j].push(novoDeck.pop());
      }
    }
    const novaMaoDealer = [novoDeck.pop(), novoDeck.pop()];
    setJogadores(novasMaos);
    setDealer(novaMaoDealer);
    setDeck(novoDeck);
    setVez(0);
    setMensagem('Vez do Jogador 1');
    setFim(false);
    setResultados([]);
    setDealerRevelado(false);
    setEstourados([false, false, false, false, false]);
  };

  const pedirCarta = () => {
    if (fim || estourados[vez]) return;
    const novaCarta = deck.pop();
    const novasMaos = [...jogadores];
    novasMaos[vez].push(novaCarta);
    setJogadores(novasMaos);
    setDeck([...deck]);
    const valor = calcularValor(novasMaos[vez]);
    if (valor > 21) {
      const novaEstourados = [...estourados];
      novaEstourados[vez] = true;
      setEstourados(novaEstourados);
      avancarJogador();
    }
  };

  const parar = () => {
    avancarJogador();
  };

  const avancarJogador = () => {
    if (vez < 4) {
      setVez(vez + 1);
      setMensagem(`Vez do Jogador ${vez + 2}`);
    } else {
      jogarDealer();
    }
  };

  const jogarDealer = () => {
    let novaMaoDealer = [...dealer];
    let novoDeck = [...deck];
    setDealerRevelado(true);

    while (calcularValor(novaMaoDealer) < 17) {
      novaMaoDealer.push(novoDeck.pop());
    }

    setDealer(novaMaoDealer);
    setDeck(novoDeck);

    const resultadoFinal = jogadores.map((mao, i) => {
      const vJog = calcularValor(mao);
      const vDeal = calcularValor(novaMaoDealer);
      if (vJog > 21) return `Jogador ${i + 1} estourou`;
      if (vDeal > 21 || vJog > vDeal) return `Jogador ${i + 1} venceu`;
      if (vJog < vDeal) return `Dealer venceu contra Jogador ${i + 1}`;
      return `Jogador ${i + 1} empatou`;
    });

    setResultados(resultadoFinal);
    setMensagem('Fim de jogo');
    setFim(true);
  };

  return (
    <div className="mesa">
      <h1>Blackjack do Blindado</h1>
      <p>{mensagem}</p>

      <div className="dealer">
        <h2>Dealer</h2>
        <div className="cartas">
          {dealer.map((carta, i) => {
            if (!dealerRevelado && i === 1) {
              return <img key={i} src="/cards/back.png" alt="carta virada" />;
            }
            return <img key={i} src={`/cards/${carta}.png`} alt={carta} />;
          })}
        </div>
        {dealerRevelado && <p>Total: {calcularValor(dealer)}</p>}
      </div>

      <div className="jogadores">
        {jogadores.map((mao, i) => (
          <div key={i} className="jogador">
            <h3 style={{ color: vez === i ? '#a3e635' : 'white' }}>
              Jogador {i + 1}
            </h3>
            <div className="cartas">
              {mao.map((carta, j) => (
                <img key={j} src={`/cards/${carta}.png`} alt={carta} />
              ))}
            </div>
            <p>Total: {calcularValor(mao)}</p>
          </div>
        ))}
      </div>

      <div className="buttons" style={{ marginTop: 20 }}>
        {!fim && !estourados[vez] && (
          <>
            <button onClick={pedirCarta}>Pedir carta</button>
            <button onClick={parar}>Parar</button>
          </>
        )}
        {fim && (
          <button onClick={distribuir}>Jogar Novamente</button>
        )}
      </div>

      {fim && (
        <div style={{ marginTop: 30 }}>
          <h3>Resultados:</h3>
          <ul>
            {resultados.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
