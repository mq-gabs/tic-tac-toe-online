const { AppError } = require("./utils/AppError");

const EnumStatus = {
  WAITING_PLAYER: "WAITING_PLAYER",
  PLAYING: "PLAYING",
  WIN: "WIN",
  TIE: "TIE",
};

class Room {
  id;
  player1;
  player2;
  status;
  grade = {
    tl: null,
    tm: null,
    tr: null,
    ml: null,
    mm: null,
    mr: null,
    bl: null,
    bm: null,
    br: null,
  };
  turn;
  winner = null;

  constructor() {
    this.status = EnumStatus.WAITING_PLAYER;
  }

  addPlayer1(player) {
    if (this.player1) throw new AppError(400, "Player 1 is already taken");

    this.player1 = player;
    this.turn = this.player1.id;
  }

  addPlayer2(player) {
    if (this.player2) throw new AppError(400, "Player 2 is already taken");

    this.player2 = player;
  }

  changeTurn() {
    if (this.turn === this.player1.id) {
      this.turn = this.player2.id;
      return;
    }

    this.turn = this.player1.id;
  }

  startGame() {
    this.status = EnumStatus.PLAYING;
  }

  reset() {
    this.grade = {
      tl: null,
      tm: null,
      tr: null,
      ml: null,
      mm: null,
      mr: null,
      bl: null,
      bm: null,
      br: null,
    };

    if (this.player1 && this.player2) {
      this.status = EnumStatus.PLAYING;
      this.turn = this.player1.id;
      return;
    }

    if (this.player1) {
      this.status = EnumStatus.WAITING_PLAYER;
      return;
    }
  }

  play({ position, player_id }) {
    if (!position || !player_id) {
      throw new AppError(
        400,
        `'position' and 'player_id' are required: position: ${position}, player_id: ${player_id}`
      );
    }

    if (!this.player2) {
      throw new AppError(400, "There is not player 2 yet");
    }

    if (!Object.keys(this.grade).includes(position)) {
      throw new AppError(400, `Invalid 'position': ${position}`);
    }

    if (player_id !== this.player1.id && player_id !== this.player2.id) {
      throw new AppError(400, `This player id is not playing: ${player_id}`);
    }

    if (this.grade[position]) {
      throw new AppError(400, "This position was already played");
    }

    this.grade[position] = player_id;

    this.changeTurn();
  }

  updateStatus() {
    if (Object.values(this.grade).filter((v) => !v).length === 0) {
      this.status = EnumStatus.TIE;
      return;
    }

    const positions = [
      ["tl", "tm", "tr"],
      ["ml", "mm", "mr"],
      ["bl", "bm", "br"],
      ["tl", "ml", "bl"],
      ["tm", "mm", "bm"],
      ["tr", "mr", "br"],
      ["tl", "mm", "br"],
      ["tr", "mm", "bl"],
    ];

    for (const position of positions) {
      if (
        this.grade[position[0]] &&
        this.grade[position[1]] &&
        this.grade[position[2]] &&
        this.grade[position[0]] === this.grade[position[1]] &&
        this.grade[position[1]] === this.grade[position[2]]
      ) {
        this.winner =
          this.player1.id === this.grade[position[0]]
            ? this.player1
            : this.player2;
        this.status = EnumStatus.WIN;
      }
    }
  }
}

module.exports = { Room };
