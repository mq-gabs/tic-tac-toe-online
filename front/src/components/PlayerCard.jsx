import X from "./X";

export default function PlayerCard({ playerName }) {
  return (
    <div className="bg-gray-200 px-4 py-2 rounded">
      <p>{playerName}</p>
    </div>
  );
}
