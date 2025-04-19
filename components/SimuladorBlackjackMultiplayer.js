
import { useState } from 'react';

const cartasBase = [
  { nome: '2', valor: 2 },
  { nome: '3', valor: 3 },
  { nome: '4', valor: 4 },
  { nome: '5', valor: 5 },
  { nome: '6', valor: 6 },
  { nome: '7', valor: 7 },
  { nome: '8', valor: 8 },
  { nome: '9', valor: 9 },
  { nome: '10', valor: 10 },
  { nome: 'J', valor: 10 },
  { nome: 'Q', valor: 10 },
  { nome: 'K', valor: 10 },
  { nome: 'A', valor: 11 },
];

const naipes = ['H', 'D', 'S', 'C'];

const criarBaralho = () => {
  const deck = [];
  for (let naipe of naipes) {
    for (let carta of cartasBase) {
      deck.push({
        nome: carta.nome + naipe,
        valor: carta.valor,
        imagem: `${carta.nome}${naipe}.png`,
      });
    }
  }
  return deck.sort(() => 0.5 - Math.random());
};

function calcularValor(mao) {
  let total = 0;
  let ases = 0;
  for (let carta of mao) {
    if (!carta || typeof carta.valor !== 'number') continue;
    total += carta.valor;
    if (carta.nome.startsWith('A')) ases++;
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
    const novoDeck = criarBaralho();
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
            if (!carta) return null;
            if (!dealerRevelado && i === 1) {
              return <img key={i} src="/cards/back.png" alt="carta virada" />;
            }
            return (
              <img key={i} src={`/cards/${carta.imagem}`} alt={carta.nome} />
            );
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
              {mao.map((carta, j) =>
                carta ? (
                  <img
                    key={j}
                    src={`/cards/${carta.imagem}`}
                    alt={carta.nome}
                  />
                ) : null
              )}
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
        {fim && <button onClick={distribuir}>Jogar Novamente</button>}
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
