export interface GeolocationPosition {
  lat: number;
  lng: number;
}

export type SocketStatus =
  | "CONNECTING"
  | "CONNECTED"
  | "DISCONNECTED"
  | "ERROR";

export interface ConnectedUser {
  userId: string;
  joinAt: Date;
  position: { lat: number; lng: number };
  updatedAt: Date;
  userName: string;
}

export interface UserRoom {
  roomId: string;
  position: { lat: number; lng: number };
  totalConnectedUsers: ConnectedUser[];
  hostId: string;
  hostName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface visitorRoom {
  roomId?: string;
  position: { lat: number; lng: number };
  hostId?: string;
  createdAt?: Date;
  updatedAt: Date;
  userId: string;
  joinAt: Date;
}

export interface VisitorUser {
  userId: string;
  name: string;
  email: string;
  joinAt: Date;
  position: { lat: number; lng: number };
  updatedAt: Date;
}

export interface HostUser {
  hostId: string;
  roomId: string;
  name: string;
  email: string;
  // location: string;
  position: { lat: number; lng: number };
  createdAt: Date;
  updatedAt: Date;
  visitorUsers: VisitorUser[];
}

// check
export interface USER_INFO {
  name: string;
  email: string;
  position: { lat: number; lng: number };
  userId: string; // socket.id
  location: string;
}

export interface CONNECTED_USER {
  userId: string; // socket.id
  joinAt: Date;
  position: { lat: number; lng: number };
  updatedAt: Date;
  userName: string;
  userEmail: string;
}

export interface HOST_ROOM {
  roomId: string;
  position: { lat: number; lng: number };
  totalConnectedUsers: CONNECTED_USER[];
  hostId: string;
  hostName: string;
  hostEmail: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface VISITOR_IN_ROOM {
  roomId: string;
  position: { lat: number; lng: number };
  hostPosition: { lat: number; lng: number };
  hostId: string;
  hostName: string;
  hostEmail: string;
  updatedAt: Date;
  userId: string;
  joinedAt: Date;
  location: string;
}
