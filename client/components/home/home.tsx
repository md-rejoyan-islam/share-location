"use client";

import { Label } from "@/components/ui/label";
import LocationContext from "@/context/location-context";
import { MapPin } from "lucide-react";
import { useContext, useEffect } from "react";
import GoogleMap from "../google-map";
import ConnectedUser from "./connected-user";
import ShareLocation from "./share-location";

function HomePage() {
  const { connectSocket, socket, userInfo } = useContext(LocationContext);

  // when component mounts connect to socket
  useEffect(() => {
    connectSocket();
    return () => {
      if (socket?.connected) {
        socket.disconnect();
      }
    };
  }, []);

  return (
    <div className={` flex flex-col `}>
      <div className="flex-1 px-4 pt-6 pb-8 bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
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
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 p-2 rounded-md gap-2">
                  <div>
                    <MapPin className="h-5 w-5 text-blue-500 " />
                  </div>
                  <span
                    id="current-location"
                    className="text-gray-800 dark:text-white"
                  >
                    {userInfo.location}
                  </span>
                </div>
              </div>
              <ShareLocation />

              <ConnectedUser />
            </div>
            <div className="p-4 md:w-1/2">
              <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                Map View
              </h2>
              <div className="h-[400px] md:h-[600px]">
                <GoogleMap
                  location={userInfo.location}
                  position={userInfo.position}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
