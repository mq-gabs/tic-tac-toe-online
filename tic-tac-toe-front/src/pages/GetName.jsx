import { useState } from "react";
import Button from "../components/Button";
import socket from "../socket";
import { storePlayerData } from "../storage";
import callServer from "../server";
import { useNavigate, useParams } from "react-router-dom";

export default function GetName() {
  const nav = useNavigate();

  const [name, setName] = useState("");

  const handleStart = async () => {
    const response = await callServer({
      method: "POST",
      path: "/players",
      data: { name },
    });

    if (!response) return;

    storePlayerData(response);

    const query = new URLSearchParams(location.search);
    const next = query.get("next");

    nav(next || "/rooms");
  };

  return (
    <main className="h-screen grid place-items-center">
      <div className="flex flex-col gap-4 w-[400px] mx-auto border p-4">
        <label htmlFor="name">Type your nickname</label>
        <input
          className="border p-2 rounded"
          id="name"
          name="name"
          type="text"
          placeholder="Nickname"
          onChange={({ target: { value } }) => setName(value)}
        />
        <Button onClick={handleStart}>Start!</Button>
      </div>
    </main>
  );
}
