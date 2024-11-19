import { HOST_ROOM, USER_INFO } from "./types";

export const defaultUserInfo: USER_INFO = {
  name: "",
  email: "",
  position: { lat: 0, lng: 0 },
  userId: "",
  location: "Loading...",
};

export const defaultHostRoom: HOST_ROOM = {
  roomId: "",
  position: { lat: 0, lng: 0 },
  totalConnectedUsers: [],
  hostId: "",
  hostName: "",
  hostEmail: "",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const defaultVisitorInRoom = {
  position: { lat: 0, lng: 0 },
  hostPosition: { lat: 0, lng: 0 },
  hostName: "",
  userId: "",
  updatedAt: new Date(),
  joinedAt: new Date(),
  location: "",
  hostEmail: "",
  hostId: "",
  roomId: "",
};
