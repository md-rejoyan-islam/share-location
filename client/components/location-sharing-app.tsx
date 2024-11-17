"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LocationContext from "@/context/location-context";
import { GeolocationPosition } from "@/lib/types";
import { MapPin, Share2, UserCheck, Users, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import Map from "./map/map";

interface User {
  id: number;
  name: string;
  location: string;
  shareName: string;
}

const users: User[] = [
  {
    id: 1,
    name: "Alice",
    location: "Los Angeles, CA 90001, USA",
    shareName: "Work",
  },
  {
    id: 2,
    name: "Bob",
    location: "Chicago, IL 60601, USA",
    shareName: "Gym",
  },
  {
    id: 3,
    name: "Charlie",
    location: "Houston, TX 77001, USA",
    shareName: "Home",
  },
];

// Simulated Google Maps API
const GoogleMap = ({
  location,
  position,
}: {
  position: GeolocationPosition | null;
  location: string;
}) => (
  <div className="w-full h-full bg-gray-300 dark:bg-gray-700 rounded-lg overflow-hidden relative">
    <div className="absolute inset-0 flex items-center justify-center">
      {/* <MapPin className="h-8 w-8 text-red-500" /> */}
      <Map location={position} />
      {/* <MapPage location={position} /> */}
    </div>
    <div className="absolute bottom-4 left-4 right-4 bg-white dark:bg-gray-800 p-2 rounded shadow z-[400]">
      <p className="text-sm text-gray-600 dark:text-gray-300">{location}</p>
    </div>
  </div>
);

export function LocationSharingApp() {
  const {
    connectSocket,
    location,
    position,
    roomInfo,
    socket,
    socketStatus,
    setSocketStatus,
    setRoomInfo,
  } = useContext(LocationContext);

  const [shareName, setShareName] = useState("");
  const [connectedUsers, setConnectedUsers] = useState<User[]>([]);

  // create room
  // const handleCreateRoom = () => {
  //   if (socket) {
  //     if (socket.connected) {
  //       socket.emit("createRoom", {
  //         position,
  //         hostName: "Alice",
  //       });
  //     }
  //     socket.on("roomCreated", (data: userRoom) => {
  //       toast.success("You are live!", {
  //         autoClose: 2000,
  //       });
  //       console.log(data);

  //       setRoomInfo(data);
  //     });
  //   }
  // };

  console.log(roomInfo);

  useEffect(() => {
    connectSocket();
    return () => {
      if (socket?.connected) {
        socket.disconnect();
      }
    };
  }, []);

  // show users
  useEffect(() => {
    // Simulate connecting with multiple users
    setTimeout(() => {
      setConnectedUsers([...users]);
    }, 5000);
  }, []);

  const handleDisconnect = (userId: number) => {
    setConnectedUsers(connectedUsers.filter((user) => user.id !== userId));
    setSocketStatus("DISCONNECTED");
  };
  const handleDisconnectLocation = () => {
    if (socket) {
      socket.emit("removeRoom", {
        roomId: roomInfo?.roomId,
      });
    }
  };

  const handleShareLocation = async () => {
    // create room
    if (socket?.connected && !roomInfo) {
      socket.emit("createRoom", {
        position,
        hostName: "JOy",
      });
    }

    setSocketStatus("CONNECTING");
  };

  return (
    <div className={`min-h-screen flex flex-col `}>
      <div className="flex-1 p-4 bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="p-4 md:w-1/2">
              <div className="mb-4">
                <Label
                  htmlFor="current-location"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Current Location
                </Label>
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
                  <MapPin className="h-5 w-5 text-blue-500 mr-2" />
                  <span
                    id="current-location"
                    className="text-gray-800 dark:text-white"
                  >
                    {location}
                  </span>
                </div>
              </div>
              <div className="mb-4">
                <Label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Share Location
                </Label>
                <div className="flex flex-col space-y-2">
                  <Input
                    type="text"
                    id="location"
                    placeholder="Enter location to share"
                    value={location}
                    // onChange={(e) => setLocation(e.target.value)}
                  />
                  <Input
                    type="text"
                    id="share-name"
                    placeholder="Enter a name for this location (e.g., Home, Work)"
                    value={shareName}
                    onChange={(e) => setShareName(e.target.value)}
                  />
                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-grow">
                      <MapPin className="h-4 w-4 mr-2" />
                      Get Current
                    </Button>
                    {roomInfo === null ? (
                      <Button
                        className="flex-grow"
                        onClick={handleShareLocation}
                        disabled={roomInfo !== null}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Location
                      </Button>
                    ) : (
                      <Button
                        className="flex-grow bg-red-500 text-white"
                        onClick={handleDisconnectLocation}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Stop Location
                      </Button>
                    )}
                    {/* <Button
                      className="flex-grow"
                      onClick={handleShareLocation}
                      disabled={
                        socketStatus === "CONNECTING" || roomInfo !== null
                      }
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Location
                    </Button> */}
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4">
                <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                  Shared With
                </h2>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <Users className="h-4 w-4 mr-2" />
                    Family Group
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <Users className="h-4 w-4 mr-2" />
                    Work Team
                  </li>
                </ul>
              </div>
              <div className="bg-green-100 dark:bg-green-800 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2 text-green-800 dark:text-green-100">
                  Connected Users
                </h2>
                {roomInfo && roomInfo?.totalConnectedUsers?.length > 0 ? (
                  <ul className="space-y-4">
                    {roomInfo.totalConnectedUsers.map((user) => (
                      <li
                        key={user.userId}
                        className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm"
                      >
                        <div className="flex items-center justify-between text-green-700 dark:text-green-200 mb-2">
                          <div className="flex items-center">
                            <UserCheck className="h-5 w-5 mr-2" />
                            {user.userName}
                            {/* ({user.shareName}) */}
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            // onClick={() => handleDisconnect(user.userId)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Disconnect
                          </Button>
                        </div>
                        <div className="text-sm text-green-600 dark:text-green-300">
                          <MapPin className="h-4 w-4 inline mr-2" />
                          {/* {user.position} */}
                          Dhaka
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-green-600 dark:text-green-300">
                    No users connected
                  </p>
                )}
              </div>
            </div>
            <div className="p-4 md:w-1/2">
              <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                Map View
              </h2>
              <div className="h-[400px] md:h-[600px]">
                <GoogleMap location={location} position={position} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
