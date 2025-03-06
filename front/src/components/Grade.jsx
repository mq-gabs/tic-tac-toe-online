import socket from "../socket";
import { getPlayerData } from "../storage";
import O from "./O";
import X from "./X";
import clsx from "clsx";

export default function Grade({
  room_id,
  grade,
  player1_id,
  player2_id,
  block,
  winnerPosition = [],
}) {
  const player = getPlayerData();

  const renderOptions = {
    [player1_id]: X,
    [player2_id]: O,
  };

  const handlePlay = (position) => {
    socket.emit("play", { position, player_id: player.id, room_id });
  };

  const Slot = ({ position }) => {
    const Render = renderOptions[grade[position]];

    const handleClick = () => {
      if (!Render && !block) {
        handlePlay(position);
      }
    };

    return (
      <div
        className={clsx({
          "bg-gray-200 rounded grid place-items-center": true,
          "cursor-pointer hover:bg-gray-400 trnasition duration-300":
            !Render && !block,
          "bg-blue-300": winnerPosition?.includes(position),
        })}
        onClick={handleClick}
      >
        {Render && <Render />}
      </div>
    );
  };

  return (
    <div className="mx-auto grid grid-cols-3 grid-rows-3 gap-4 max-w-[500px] aspect-square bg-gray-50 p-4 rounded">
      <Slot position="tl" />
      <Slot position="tm" />
      <Slot position="tr" />
      <Slot position="ml" />
      <Slot position="mm" />
      <Slot position="mr" />
      <Slot position="bl" />
      <Slot position="bm" />
      <Slot position="br" />
    </div>
  );
}
