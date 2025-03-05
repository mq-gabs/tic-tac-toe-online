import GetName from "./pages/GetName";
import Game from "./pages/Game";
import { getPlayerData, getRoomData } from "./storage";
import Rooms from "./pages/Rooms";
import GameRouter from "./pages";

export default function App() {
  return <GameRouter />;
}
