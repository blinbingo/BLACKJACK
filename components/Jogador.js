export default function Jogador({ nome, cartas }) {
  return (
    <div className="jogador">
      <img src={`/avatars/${nome}.png`} alt={nome} className="avatar" />
      <div className="cartas">
        {cartas.map((carta, index) => (
          <img key={index} src={`/cards/${carta}`} alt={carta} />
        ))}
      </div>
    </div>
  );
}
