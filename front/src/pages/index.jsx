import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import GetName from "./GetName";
import Home from "./Home";
import Rooms from "./Rooms";
import Game from "./Game";

export default function GameRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/rooms" Component={Rooms} />
        <Route path="/room/:id" Component={Game} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
