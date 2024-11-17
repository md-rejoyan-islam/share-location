import {
  GeolocationPosition,
  SocketStatus,
  UserRoom,
  visitorRoom,
} from "@/lib/types";
import { createContext } from "react";
import { Socket } from "socket.io-client";

interface LocationContextType {
  socket: Socket | null;
  socketStatus: SocketStatus;
  roomInfo: UserRoom | null;
  location: string;
  position: GeolocationPosition | null;
  connectSocket: () => void;
  setSocketStatus: (status: SocketStatus) => void;
  setRoomInfo: (room: UserRoom | null) => void;
  visitorRoomInfo: visitorRoom | null;
}

const LocationContext = createContext<LocationContextType>({
  socket: null,
  socketStatus: "DISCONNECTED",
  roomInfo: null,
  location: "Loading...",
  position: { lat: 0, lng: 0 },
  connectSocket: () => {},
  setSocketStatus: () => {},
  setRoomInfo: () => {},
  visitorRoomInfo: null,
});

export default LocationContext;
