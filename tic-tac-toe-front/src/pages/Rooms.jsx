import { useEffect, useState } from "react";
import RoomCard from "../components/RoomCard";
import Button from "../components/Button";
import callServer from "../server";
import { getPlayerData, storePlayerData, storeRoomData } from "../storage";
import { useNavigate } from "react-router-dom";
import socket from "../socket";

export default function Rooms() {
  const nav = useNavigate();

  const player = getPlayerData();
  const [rooms, setRooms] = useState([]);

  console.log({ rooms });

  const loadPlayer = async () => {
    if (!player.id) return;

    const response = await callServer({
      path: `/players/${player.id}`,
    });

    if (!response) return;

    if (response?.error) {
      storePlayerData(0);
      nav("/");
      return;
    }
  };

  const loadRooms = async () => {
    const response = await callServer({
      path: "/rooms",
    });

    if (!response) return;

    setRooms(response);
  };

  const createRoom = async () => {
    const response = await callServer({
      method: "POST",
      path: "/rooms",
      data: { player_id: player.id },
    });

    if (!response) return;

    storeRoomData(response);
    nav(`/room/${response.id}`);
  };

  const setSocket = () => {
    socket.on("update_rooms_list", (rooms) => {
      setRooms(rooms);
    });
  };

  useEffect(() => {
    setSocket();
  }, [rooms]);

  useEffect(() => {
    loadPlayer().then(() => loadRooms());
  }, []);

  if (!player.id) {
    nav("/");
    return <></>;
  }

  return (
    <main>
      <div className="max-w-[800px] mx-auto mt-4">
        <Button onClick={createRoom}>New room</Button>
        {rooms.length !== 0 && (
          <ul className="flex flex-col gap-2 mt-4">
            {rooms.map((data) => (
              <li key={data.id}>
                <RoomCard data={data} />
              </li>
            ))}
          </ul>
        )}
        {rooms.length === 0 && <p>No rooms yet...</p>}
      </div>
    </main>
  );
}
