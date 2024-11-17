import { SocketStatus, UserRoom } from "@/lib/types";
import { hostRooom, userInfo, visitorRoom } from "@/provider/location-provider";
import { createContext } from "react";
import { Socket } from "socket.io-client";

interface LocationContextType {
  socket: Socket | null;
  socketStatus: SocketStatus;
  roomInfo: UserRoom | null;
  connectSocket: () => void;
  setSocketStatus: (status: SocketStatus) => void;
  setRoomInfo: (room: UserRoom | null) => void;
  hostRooom: hostRooom | null;
  setHostRoom: (room: hostRooom | null) => void;
  userInfo: userInfo;
  setUserInfo: (user: userInfo) => void;
  setVisitorRoomInfo: (visitorRoomInfo: visitorRoom) => void;
  visitorRoomInfo: visitorRoom;
}

const LocationContext = createContext<LocationContextType>({
  socket: null,
  socketStatus: "DISCONNECTED",
  roomInfo: null,
  connectSocket: () => {},
  setSocketStatus: () => {},
  setRoomInfo: () => {},
  visitorRoomInfo: {
    position: { lat: 0, lng: 0 },
    hostName: "",
    userId: "",
    updatedAt: new Date(),
    joinedAt: new Date(),
    location: "",
  },
  hostRooom: null,
  setHostRoom: () => {},
  userInfo: {
    name: "",
    email: "",
    position: { lat: 0, lng: 0 },
    userId: "",
    location: "",
  },
  setUserInfo: () => {},
  setVisitorRoomInfo: () => {},
});

export default LocationContext;
