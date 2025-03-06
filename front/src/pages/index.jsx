import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import GetName from "./GetName";
import Home from "./Home";
import Rooms from "./Rooms";
import Game from "./Game";
import bgPNG from "../assets/tic-tac-toe.png";

export default function GameRouter() {
  return (
    <BrowserRouter>
      <div className="z-[-1] absolute overflow-clip top-0 w-full h-full bg-[url('assets/tic-tac-toe.png')] blur-sm"></div>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/rooms" Component={Rooms} />
        <Route path="/room/:id" Component={Game} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
