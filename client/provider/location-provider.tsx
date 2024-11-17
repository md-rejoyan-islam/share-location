"use client";
import { useSocket } from "@/components/hook/use-socket";
import LocationContext from "@/context/location-context";
import { SocketStatus } from "@/lib/types";
import { fetchLocation } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface connectedUser {
  userId: string;
  joinAt: Date;
  position: { lat: number; lng: number };
  updatedAt: Date;
  userName: string;
}

interface userRoom {
  roomId: string;
  position: { lat: number; lng: number };
  totalConnectedUsers: connectedUser[];
  hostId: string;
  hostName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface visitorRoom {
  roomId?: string;
  position: { lat: number; lng: number };
  hostId?: string;
  hostName: string;
  updatedAt: Date;
  userId: string;
  joinedAt: Date;
  location: string;
}
export interface userInfo {
  name: string;
  email: string;
  position: { lat: number; lng: number };
  userId: string;
  location: string;
}
export interface hostRooom {
  roomId: string;
  position: { lat: number; lng: number };
  totalConnectedUsers: connectedUser[];
  hostId: string;
  hostName: string;
  createdAt: Date;
  updatedAt: Date;
}

export const LocationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { socket, connectSocket } = useSocket();
  const [socketStatus, setSocketStatus] =
    useState<SocketStatus>("DISCONNECTED");

  const [userInfo, setUserInfo] = useState<userInfo>({
    name: "",
    email: "",
    position: { lat: 0, lng: 0 },
    location: "Loading...",
    userId: "",
  });
  const [hostRooom, setHostRoom] = useState<hostRooom | null>(null);

  const [roomInfo, setRoomInfo] = useState<userRoom | null>(null);
  const [visitorRoomInfo, setVisitorRoomInfo] = useState<visitorRoom>({
    position: { lat: 0, lng: 0 },
    hostName: "",
    userId: "",
    updatedAt: new Date(),
    joinedAt: new Date(),
    location: "",
  });

  // Get the current location
  useEffect(() => {
    // Ensure the geolocation code runs only in the browser
    if (typeof window !== "undefined" && navigator.geolocation) {
      const watcherId = navigator.geolocation.watchPosition(
        (position) => {
          // fetch location from lat and lng
          fetchLocation(
            position.coords.latitude,
            position.coords.longitude
          ).then((location) => {
            setUserInfo((prev) => ({
              ...prev,
              position: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
              location,
            }));
          });
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              // setLocationStatus("denied");
              break;
            case error.POSITION_UNAVAILABLE:
              // setLocationStatus("unknown");
              break;
            case error.TIMEOUT:
              // setLocationStatus("error");
              break;
            default:
              // setLocationStatus("error");
              break;
          }
        }
      );

      // Cleanup watcher on unmount
      return () => navigator.geolocation.clearWatch(watcherId);
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (socket) {
      // roomCreated
      socket.on("roomCreated", (data: userRoom) => {
        toast.success("You are live!", {
          autoClose: 2000,
        });
        // setRoomInfo(data);
        setHostRoom((prev) => {
          return {
            ...prev,
            roomId: data.roomId,
            position: data.position,
            hostId: data.hostId,
            hostName: data.hostName,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            totalConnectedUsers: data.totalConnectedUsers,
          };
        });
      });
      socket.on("roomRemoved", () => {
        toast.error("Room removed", {
          autoClose: 2000,
        });
        setHostRoom(null);
      });

      socket.on("userJoinedRoom", (data) => {
        setHostRoom((prev) => {
          if (prev) {
            return {
              ...prev,
              totalConnectedUsers: prev.totalConnectedUsers.find(
                (user) => user.userId === data.userId
              )
                ? prev.totalConnectedUsers
                : [...prev.totalConnectedUsers, data],
            };
          }
          return null;
        });
        // setVisitorRoomInfo(data);

        toast.info(`${data.userName} joined the room`, {
          autoClose: 2000,
        });

        if (hostRooom?.position) {
          socket.emit("updateLocation", {
            position: hostRooom.position,
          });
        }
      });

      socket.on("userLeftRoom", (data) => {
        setHostRoom((prev) => {
          if (prev) {
            return {
              ...prev,
              totalConnectedUsers: prev.totalConnectedUsers.filter(
                (user) => user.userId !== data.userId
              ),
            };
          }
          return null;
        });
        toast.info(`${data.userName} left the room`, {
          autoClose: 2000,
        });
      });

      // when user join room
      socket.on("roomJoined", (data) => {
        console.log(data.position);

        fetchLocation(data.position.lat, data.position.lng).then((location) => {
          setVisitorRoomInfo((prev) => {
            return {
              ...prev,
              hostName: data.hostName,
              roomId: data.roomId,
              position: data.position,
              joinedAt: data.joinedAt,
              updatedAt: data.updatedAt,
              userId: data.userId,
              hostId: data.hostId,
              location,
            };
          });
        });
      });

      // when update location
      socket.on("updateLocationResponse", (data) => {
        fetchLocation(data.position.lat, data.position.lng).then((location) => {
          setVisitorRoomInfo((prev) => {
            return {
              ...prev,
              position: data.position,
              updatedAt: new Date(),
              location,
            };
          });
        });
      });
      // socket.on("disconnect", (data) => {
      //   setSocketStatus("DISCONNECTED");

      //   // if user disconnects, notify host
      //   setHostRoom((prev) => {
      //     if (prev) {
      //       const user = prev.totalConnectedUsers.find(
      //         (user) => user.userId === data.userId
      //       );
      //       if (user) {
      //         toast.info(`${data.userId} left the room`, {
      //           autoClose: 2000,
      //         });
      //         return {
      //           ...prev,
      //           totalConnectedUsers: prev.totalConnectedUsers.filter(
      //             (user) => user.userId !== data.userId
      //           ),
      //         };
      //       }
      //     }
      //     return null;
      //   });
      // });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.emit("updateLocation", {
        position: hostRooom?.position,
      });
    }
  }, [hostRooom?.position]);

  return (
    <LocationContext.Provider
      value={{
        socket,
        socketStatus,
        roomInfo,
        connectSocket,
        setSocketStatus,
        setRoomInfo,
        visitorRoomInfo,
        userInfo,
        setUserInfo,
        hostRooom,
        setHostRoom,
        setVisitorRoomInfo,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
