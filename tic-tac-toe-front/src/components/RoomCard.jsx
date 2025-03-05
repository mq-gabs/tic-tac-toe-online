import callServer from "../server";
import socket from "../socket";
import { getPlayerData } from "../storage";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

export default function RoomCard({ data: { id, player1, player2, status } }) {
  const nav = useNavigate();
  const player = getPlayerData();

  const handleEnterRoom = async () => {
    const response = await callServer({
      method: "PATCH",
      path: `/rooms/${id}/enter`,
      data: { player_id: player.id },
    });

    if (!response) return;

    if (response.error) return;

    nav(`/room/${id}`);
  };

  return (
    <div className="bg-gray-100 rounded p-2">
      <small>id: {id}</small>
      <p>Status: {status}</p>
      <p>Player 1: {player1.name}</p>
      {player2 && <p>Player 2: {player2.name}</p>}
      <Button
        disabled={player2 || player2?.id === player.id}
        onClick={handleEnterRoom}
      >
        Enter
      </Button>
    </div>
  );
}
