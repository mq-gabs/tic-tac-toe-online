import { io, Manager } from "socket.io-client";

const socket = io(import.meta.env.VITE_SERVER_HOST);

export default socket;
