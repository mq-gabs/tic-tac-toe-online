import { getPlayerData, getRoomData } from "../storage";
import { useNavigate } from "react-router-dom";
import GetName from "./GetName";

export default function Home() {
  const nav = useNavigate();

  const room = getRoomData();

  if (room) {
    nav(`/room/${room.id}`);
  }

  if (getPlayerData()) {
    nav("/rooms");
  }

  return <GetName />;
}
