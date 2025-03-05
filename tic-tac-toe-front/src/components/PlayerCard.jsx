import X from "./X";

export default function PlayerCard({ playerName, isPlayer1 }) {
  return (
    <div className="bg-gray-200 p-4 rounded">
      <p>{playerName}</p>
      {/* {isPlayer1 ? <X /> : <O />} */}
    </div>
  );
}
