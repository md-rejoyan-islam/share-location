"use client";
import { useSocket } from "@/components/hook/use-socket";
import LocationContext from "@/context/location-context";
import { GeolocationPosition, SocketStatus } from "@/lib/types";
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

interface visitorRoom {
  roomId?: string;
  position: { lat: number; lng: number };
  hostId?: string;
  createdAt?: Date;
  updatedAt: Date;
  userId: string;
  joinAt: Date;
}

export const LocationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { socket, connectSocket } = useSocket();
  const [socketStatus, setSocketStatus] =
    useState<SocketStatus>("DISCONNECTED");
  const [roomInfo, setRoomInfo] = useState<userRoom | null>(null);
  const [visitorRoomInfo, setVisitorRoomInfo] = useState<visitorRoom | null>(
    null
  );
  const [location, setLocation] = useState<string>("Loading...");
  const [shareName, setShareName] = useState("");
  const [position, setPosition] = useState<GeolocationPosition | null>(null);

  console.log(roomInfo);

  // Get the current location
  useEffect(() => {
    // Ensure the geolocation code runs only in the browser
    if (typeof window !== "undefined" && navigator.geolocation) {
      const watcherId = navigator.geolocation.watchPosition(
        (position) => {
          // call fetchlocation to get the location
          fetchLocation(
            position.coords.latitude,
            position.coords.longitude
          ).then((location) => {
            setLocation(location);
            // setCurrentLocation(location);
          });
          // Set the position state
          setPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
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
        setRoomInfo(data);
      });
      socket.on("roomRemoved", () => {
        toast.error("Room removed", {
          autoClose: 2000,
        });
        setRoomInfo(null);
      });

      socket.on("userJoinedRoom", (data) => {
        console.log("userJoinedRoom", data);

        setRoomInfo((prev) => {
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
        setVisitorRoomInfo(data);

        toast.info(`${data.userId} joined the room`, {
          autoClose: 2000,
        });

        if (position) {
          socket.emit("updateLocation", {
            position,
          });
        }
      });

      socket.on("userLeftRoom", (data) => {
        setRoomInfo((prev) => {
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
        toast.info(`${data.userId} left the room`, {
          autoClose: 2000,
        });
      });

      socket.on("disconnect", (data) => {
        setSocketStatus("DISCONNECTED");

        // if user disconnects, notify host
        setRoomInfo((prev) => {
          if (prev) {
            const user = prev.totalConnectedUsers.find(
              (user) => user.userId === data.userId
            );
            if (user) {
              toast.info(`${data.userId} left the room`, {
                autoClose: 2000,
              });
              return {
                ...prev,
                totalConnectedUsers: prev.totalConnectedUsers.filter(
                  (user) => user.userId !== data.userId
                ),
              };
            }
          }
          return null;
        });
      });
    }
  }, [socket, position]);

  return (
    <LocationContext.Provider
      value={{
        socket,
        socketStatus,
        roomInfo,
        location,
        position,
        connectSocket,
        setSocketStatus,
        setRoomInfo,
        visitorRoomInfo,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
