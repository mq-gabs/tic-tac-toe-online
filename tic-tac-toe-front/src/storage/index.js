const playerDataKey = "@tic-tac-toe-online:player-data";
const roomDataKey = "@tic-tac-toe-online:room-data";

export function getPlayerData() {
  return JSON.parse(localStorage.getItem(playerDataKey) || "0");
}

export function storePlayerData(data) {
  localStorage.setItem(playerDataKey, JSON.stringify(data || 0));
}

export function getRoomData() {
  return JSON.parse(localStorage.getItem(roomDataKey || "0"));
}

export function storeRoomData(data) {
  localStorage.setItem(roomDataKey, JSON.stringify(data || 0));
}
