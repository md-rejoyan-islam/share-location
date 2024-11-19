"use client";
import { useSocket } from "@/components/hook/use-socket";
import LocationContext from "@/context/location-context";
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
import { fetchLocation } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const LocationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { socket } = useSocket();
  const [socketStatus, setSocketStatus] =
    useState<SocketStatus>("DISCONNECTED");

  // default user info
  const [userInfo, setUserInfo] = useState<USER_INFO>(defaultUserInfo);

  const [hostRooom, setHostRoom] = useState<HOST_ROOM>(defaultHostRoom);

  const [visitorRoomInfo, setVisitorRoomInfo] =
    useState<VISITOR_IN_ROOM>(defaultVisitorInRoom);

  console.log("user position");

  console.log(userInfo.position);
  console.log("host position");

  console.log(hostRooom.position);

  // Get the current location and update the user info
  useEffect(() => {
    // Ensure the geolocation code runs only in the browser
    if (typeof window !== "undefined" && navigator.geolocation) {
      const watcherId = navigator.geolocation.watchPosition(
        (position) => {
          // fetch location from lat and lng and update user info

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

            setHostRoom((prev) => {
              return {
                ...prev,
                position: {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                },
                location,
              };
            });
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
      socket.on("roomCreated", (data: HOST_ROOM) => {
        toast.success("Your location is live!", {
          autoClose: 2000,
        });

        setHostRoom((prev) => {
          return {
            ...prev,
            roomId: data.roomId,
            position: data.position,
            hostId: data.hostId,
            hostName: data.hostName,
            hostEmail: data.hostEmail,
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
        setHostRoom(defaultHostRoom);
      });

      socket.on("userLeftRoom", (data) => {
        setHostRoom((prev) => {
          return {
            ...prev,
            totalConnectedUsers: prev.totalConnectedUsers.filter(
              (user) => user.userId !== data.userId
            ),
          };
        });
        toast.info(`${data.userName} is now offline.`, {
          autoClose: 2000,
        });
      });

      // when user join room
      socket.on("roomJoined", (data) => {
        if (data.status === "ERROR") return;

        fetchLocation(data.position.lat, data.position.lng).then((location) => {
          setVisitorRoomInfo((prev) => {
            return {
              ...prev,
              hostName: data.hostName,
              hostEmail: data.hostEmail,
              roomId: data.roomId,
              position: data.position,
              hostPosition: data.hostPosition,
              joinedAt: data.joinedAt,
              updatedAt: data.updatedAt,
              userId: data.userId,
              hostId: data.hostId,
              location,
            };
          });
        });
      });

      // when user joined room notify host
      socket.on("userJoinedRoom", (data) => {
        setHostRoom((prev) => {
          return {
            ...prev,
            totalConnectedUsers: prev.totalConnectedUsers.find(
              (user) => user.userId === data.userId
            )
              ? prev.totalConnectedUsers
              : [...prev.totalConnectedUsers, data],
          };
        });
        // setVisitorRoomInfo(data);
        toast.info(`${data.userName} watches your location.`, {
          autoClose: 2000,
        });

        // socket.emit("updateLocation", {
        //   position: hostRooom && hostRooom?.position,
        // });
      });

      // when update location
      socket.on("updateLocationResponse", (data) => {
        console.log("updateLocationResponse", data);

        fetchLocation(data.hostPosition.lat, data.hostPosition.lng).then(
          (location) => {
            setVisitorRoomInfo((prev) => {
              return {
                ...prev,
                position: data.position,
                hostPosition: data.hostPosition,
                updatedAt: new Date(),
                location,
              };
            });
          }
        );
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
    if (socket && hostRooom.roomId) {
      if (userInfo?.position.lat) {
        socket.emit("updateLocation", {
          hostPosition: userInfo?.position,
        });
      }
    }
  }, [userInfo?.position, socket, hostRooom.roomId]);

  return (
    <LocationContext.Provider
      value={{
        socket,
        socketStatus,
        setSocketStatus,
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
