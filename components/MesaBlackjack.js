import Dealer from './Dealer';
import Jogador from './Jogador';

export default function MesaBlackjack() {
  const jogadores = ['dragao', 'tigre', 'aguia', 'lobo', 'leao'];
  const cartasExemplo = ['AS.png', '10C.png'];

  return (
    <div className="mesa">
      <h1>Blackjack do Blindado</h1>
      <Dealer cartas={cartasExemplo} />
      <div className="jogadores">
        {jogadores.map((nome, i) => (
          <Jogador key={i} nome={nome} cartas={['KD.png', '2H.png']} />
        ))}
      </div>
    </div>
  );
}
