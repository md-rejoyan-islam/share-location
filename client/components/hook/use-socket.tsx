import { useState } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const SOCKET_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  if (!SOCKET_URL) {
    throw new Error("Socket URL is missing!");
  }

  const connectSocket = () => {
    if (!socket) {
      const newSocket: Socket = io(SOCKET_URL);
      setSocket(newSocket);
      return;
    }
    socket.connect();
  };

  return { socket, connectSocket };
};
