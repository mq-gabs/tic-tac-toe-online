require("express-async-errors");
const { Server } = require("socket.io");
const { createServer } = require("http");
const express = require("express");
const cors = require("cors");
const { Service } = require("./src/Service");
const { errorHandler } = require("./src/utils/errorHandler");

const service = new Service();

const app = express();
app.use(express.json());
app.use(cors());

const server = createServer(app);

const io = new Server(server, {
  cors: {
    allowedHeaders: "*",
    origin: "*",
  },
});

function emitUpdateRoom(room_id, payload) {
  io.emit(`update_room_${room_id}`, payload);
}

function emitUpdateRoomsList(payload) {
  io.emit(`update_rooms_list`, payload);
}

io.on("connection", (socket) => {
  socket.on("play", ({ player_id, room_id, position }) => {
    const room = service.play({ player_id, room_id, position });
    emitUpdateRoom(room_id, { room });
  });

  socket.on("remove", ({ player_id, room_id }) => {
    const room = service.removePlayerFromRoom({ player_id, room_id });
    emitUpdateRoom(room_id, { room, player_id });
    const rooms = service.listRooms();
    emitUpdateRoomsList(rooms);
  });

  socket.on("reset", ({ room_id }) => {
    const room = service.resetRoom(room_id);
    emitUpdateRoom(room_id, { room });
    const rooms = service.listRooms();
    emitUpdateRoomsList(rooms);
  });
});

app.get("/players/:id", (req, res) => {
  const player = service.getPlayer(req.params.id);
  res.json(player);
});

app.post("/players", (req, res) => {
  const player = service.createPlayer(req.body.name);
  res.json(player);
});

app.get("/rooms", (req, res) => {
  const rooms = service.listRooms();
  res.json(rooms);
});

app.patch("/rooms/:id/enter", (req, res) => {
  const room = service.enterRoom({
    player_id: req.body.player_id,
    room_id: req.params.id,
  });
  emitUpdateRoom(room.id, { room });
  res.json(room);
});

app.get("/rooms/:id", (req, res) => {
  const room = service.getRoom(req.params.id);
  res.json(room);
});

app.post("/rooms", (req, res) => {
  const room = service.createRoom(req.body.player_id);
  const rooms = service.listRooms();
  emitUpdateRoomsList(rooms);
  res.json(room);
});

app.use(errorHandler);

server.listen(5000, () => console.log("Server started!!!"));
