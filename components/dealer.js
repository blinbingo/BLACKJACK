export default function Dealer({ cartas }) {
  return (
    <div className="dealer">
      <img src="/avatars/dealer.png" alt="Dealer" className="avatar" />
      <div className="cartas">
        {cartas.map((carta, index) => (
          <img key={index} src={`/cards/${carta}`} alt={carta} />
        ))}
      </div>
    </div>
  );
}
