import { useEffect, useState } from "react";
import {
  getPlayerData,
  getRoomData,
  storePlayerData,
  storeRoomData,
} from "../storage";
import socket from "../socket";
import Grade from "../components/Grade";
import { useNavigate } from "react-router-dom";
import callServer from "../server";
import PlayerCard from "../components/PlayerCard";
import Button from "../components/Button";
import clsx from "clsx";

export const EnumStatus = {
  WAITING_PLAYER: "WAITING_PLAYER",
  PLAYING: "PLAYING",
  WIN: "WIN",
  TIE: "TIE",
};

const statusTexts = {
  [EnumStatus.TIE]: "It's a tie",
  [EnumStatus.WAITING_PLAYER]: "Waiting for player",
  [EnumStatus.WIN]: "End of Game",
};

function GameStatus({ status, turnIsThisPlayer }) {
  let text = statusTexts[status];

  if (!text) {
    if (turnIsThisPlayer) {
      text = "Your turn";
    } else {
      text = "Wait for play";
    }
  }

  return (
    <p className="text-5xl mb-4 text-center font-bold text-prim">{text}</p>
  );
}

export default function Game() {
  const nav = useNavigate();
  const [, , room_id] = location.pathname.split("/");

  const [player] = useState(getPlayerData());

  const [room, setRoom] = useState({});

  const loadPlayer = async () => {
    if (!player.id) return;

    const response = await callServer({
      path: `/players/${player.id}`,
    });

    if (!response) return;

    if (response.error) {
      storePlayerData();
      nav(`/?next=/room/${room_id}`);
      return;
    }
  };

  const loadRoom = async () => {
    const response = await callServer({
      path: `/rooms/${room_id}`,
    });

    if (!response) return;

    if (response.error) {
      storeRoomData("");
      nav("/rooms");
      return;
    }

    setRoom(response);
  };

  useEffect(() => {
    loadPlayer().then(() => loadRoom());
  }, []);

  const setSocket = () => {
    if (!room?.id) return;
    socket.on(`update_room_${room.id}`, ({ room, player_id }) => {
      if (!room && player_id !== player.id) {
        alert("Some error ocurred!");
        nav("/rooms");
        return;
      }
      setRoom(room);
      storeRoomData(room);
    });
  };

  useEffect(() => {
    setSocket();
  }, [room]);

  const handleExit = () => {
    socket.emit("remove", { player_id: player.id, room_id: room.id });
    nav("/rooms");
  };

  const handleResetRoom = () => {
    socket.emit("reset", { room_id: room.id });
  };

  if (!player) {
    nav(`/?next=/room/${room_id}`);
    return <></>;
  }

  if (!room?.id) return <></>;

  return (
    <main>
      <div className="mt-8 max-w-[800px] mx-auto p-4">
        <div className="flex justify-end mb-4">
          <Button onClick={handleExit}>Exit</Button>
        </div>
        <GameStatus
          status={room.status}
          turnIsThisPlayer={room.turn === player.id}
        />
        <Grade
          room_id={room.id}
          grade={room.grade}
          player1_id={room?.player1?.id}
          player2_id={room?.player2?.id}
          block={room.status !== EnumStatus.PLAYING || room.turn !== player.id}
          winnerPosition={room.winnerPosition}
        />
        <div className="flex gap-2 justify-center mt-4">
          <PlayerCard isPlayer1 playerName={room.player1.name} />
          {room.player2 && <PlayerCard playerName={room?.player2?.name} />}
        </div>
        {room.winner && (
          <p
            className={clsx({
              "text-3xl mb-2 mt-4 font-semibold text-center": true,
              "text-green-500 animate-bounce": player.id === room.winner.id,
              "text-red-500": player.id !== room.winner.id,
            })}
          >
            You {player.id === room.winner.id ? "win!!!" : "lose..."}
          </p>
        )}
        {[EnumStatus.WIN, EnumStatus.TIE].includes(room.status) && (
          <div className="flex justify-center mt-4">
            <Button onClick={handleResetRoom}>Play again!</Button>
          </div>
        )}
      </div>
    </main>
  );
}
