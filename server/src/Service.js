const { v4 } = require("uuid");
const { AppError } = require("./utils/AppError");
const { Player } = require("./Player");
const { Room } = require("./Room");

class Service {
  players = [];
  rooms = [];

  getPlayer(player_id) {
    const player = this.players.find(({ id }) => id === player_id);

    if (!player) {
      throw new AppError(404, `Player not found with id: ${player_id}`);
    }

    return player;
  }

  getRoom(room_id) {
    const room = this.rooms.find(({ id }) => id === room_id);

    if (!room) {
      throw new AppError(404, `Room not found with id: ${room_id}`);
    }

    return room;
  }

  createPlayer(name) {
    if (!name) {
      throw new AppError(400, "Bad Request", "'name' cannot be empty");
    }

    const player = new Player();

    while (!player.id) {
      const newId = v4();
      if (!this.players.find(({ id }) => id === newId)) {
        player.id = newId;
      }
    }

    player.name = name;

    this.players.push(player);

    return player;
  }

  createRoom(player_id) {
    const room = new Room();
    const player = this.getPlayer(player_id);

    while (!room.id) {
      const newId = v4();
      if (!this.rooms.find(({ id }) => id === newId)) {
        room.id = newId;
      }
    }

    room.addPlayer1(player);

    this.rooms.push(room);

    return room;
  }

  enterRoom({ player_id, room_id }) {
    const room = this.getRoom(room_id);
    const player = this.getPlayer(player_id);

    room.addPlayer2(player);
    if (room.player1) {
      room.startGame();
    }

    return room;
  }

  play({ player_id, room_id, position }) {
    const room = this.getRoom(room_id);

    room.play({ position, player_id });

    room.updateStatus();

    return room;
  }

  listRooms() {
    return this.rooms;
  }

  removeRoom(room_id) {
    this.rooms = this.rooms.filter(({ id }) => id !== room_id);
  }

  resetRoom(room_id) {
    const room = this.getRoom(room_id);

    room.reset();

    return room;
  }

  removePlayerFromRoom({ room_id, player_id }) {
    const room = this.getRoom(room_id);
    if (room?.player1?.id !== player_id && room?.player2?.id !== player_id) {
      throw new AppError(
        400,
        `This player is not in this room, id: ${room_id}`
      );
    }

    if (room?.player1?.id === player_id) {
      if (!room.player2) {
        this.removeRoom(room_id);
        return;
      }

      room.player1 = room.player2;
      room.player2 = null;
      room.reset();

      return room;
    }

    if (room?.player2?.id === player_id) {
      if (!room.player1) {
        this.removeRoom(room_id);
        return;
      }

      room.player2 = null;
      room.reset();

      return room;
    }

    throw new AppError(500, "Nothing happend");
  }
}

module.exports = { Service };
