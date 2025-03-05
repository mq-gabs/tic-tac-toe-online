import socket from "../socket";
import { getPlayerData } from "../storage";
import O from "./O";
import X from "./X";

export default function Grade({
  room_id,
  grade,
  player1_id,
  player2_id,
  block,
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
        className="bg-gray-200 rounded grid place-items-center"
        onClick={handleClick}
      >
        {Render && <Render />}
      </div>
    );
  };

  return (
    <div className="mx-auto grid grid-cols-3 grid-rows-3 gap-4 w-[500px] h-[500px] bg-gray-50 p-4 rounded">
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
