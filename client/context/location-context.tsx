import {
  defaultHostRoom,
  defaultUserInfo,
  defaultVisitorInRoom,
} from "@/lib/default-value";
import {
  HOST_ROOM,
  SocketStatus,
  USER_INFO,
  VISITOR_IN_ROOM,
} from "@/lib/types";
import { createContext } from "react";
import { Socket } from "socket.io-client";

interface LocationContextType {
  socket: Socket | null;
  socketStatus: SocketStatus;
  setSocketStatus: (status: SocketStatus) => void;
  hostRooom: HOST_ROOM;
  setHostRoom: (room: HOST_ROOM) => void;
  userInfo: USER_INFO;
  setUserInfo: (user: USER_INFO) => void;
  setVisitorRoomInfo: (visitorRoomInfo: VISITOR_IN_ROOM) => void;
  visitorRoomInfo: VISITOR_IN_ROOM;
}

const LocationContext = createContext<LocationContextType>({
  socket: null,
  socketStatus: "DISCONNECTED",
  setSocketStatus: () => {},
  visitorRoomInfo: defaultVisitorInRoom,
  hostRooom: defaultHostRoom,
  setHostRoom: () => {},
  userInfo: defaultUserInfo,
  setUserInfo: () => {},
  setVisitorRoomInfo: () => {},
});

export default LocationContext;
