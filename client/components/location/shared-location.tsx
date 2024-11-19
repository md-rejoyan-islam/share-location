"use client";

import { Button } from "@/components/ui/button";
import LocationContext from "@/context/location-context";
import { formatDate } from "@/lib/utils";
import { Clock2, Home, Mail, MapPin, SquareUserRound, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import GoogleMap from "../google-map";
import PopupDialog from "../popup-dialog";

export function SharedLocationPage() {
  const { roomId } = useParams();

  const { visitorRoomInfo, socket, userInfo } = useContext(LocationContext);

  const [loading, setLoading] = useState(true);
  const [isSharing, setIsSharing] = useState(false);

  const [notFound, setNotFound] = useState(false);

  const handleStopSharing = () => {
    setIsSharing(false);
  };

  // checked room id when component mounted
  useEffect(() => {
    if (socket && roomId && userInfo.name) {
      socket.emit(
        "joinRoom",
        {
          roomId,
          userName: userInfo.name,
          userEmail: userInfo.email,
          position: userInfo.position,
        },
        (isExist: boolean) => {
          if (isExist) {
            setLoading(false);
          } else {
            setNotFound(true);
            setLoading(false);
          }
        }
      );
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, socket, userInfo.name, userInfo.email]);

  if (loading) return <p>Loading...</p>;

  if (notFound) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Invalid Room ID
          </h2>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={` flex flex-col `}>
      <div className="flex-1 px-4 pt-6 pb-8 bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="p-4 lg:p-6  md:w-1/2 space-y-3">
              <div className="flex flex-col space-y-1.5">
                <div className="font-semibold leading-none tracking-tight">
                  Shared Location
                </div>
                <div className="text-sm text-muted-foreground">
                  View the location shared with you
                </div>
              </div>
              {visitorRoomInfo.roomId ? (
                <div className="space-y-4">
                  <div className="">
                    <h2 className="pb-2 font-semibold">Host</h2>
                    <div className="space-y-2">
                      <p className="text-gray-500 dark:text-gray-40 dark:bg-gray-700 dark:text-white flex gap-2 px-2 items-center bg-gray-50 py-1.5  rounded-sm ">
                        <SquareUserRound className="w-4 h-4 text-green-700 dark:text-green-200" />
                        {visitorRoomInfo.hostName}
                      </p>
                      <p className="text-gray-500 dark:text-gray-40 dark:bg-gray-700 dark:text-white flex gap-2 px-2 items-center bg-gray-50 py-1.5  rounded-sm ">
                        <Mail className="w-4 h-4 text-green-700 dark:text-green-200" />
                        {visitorRoomInfo.hostEmail}
                      </p>
                      <p className="text-gray-500 dark:text-gray-40 dark:bg-gray-700 dark:text-white flex gap-2 px-2 items-center bg-gray-50 py-1.5  rounded-sm ">
                        <MapPin className="w-4 h-4 text-green-700 dark:text-green-200" />
                        {visitorRoomInfo.location}
                      </p>
                      <p className="text-gray-500 dark:text-gray-40 dark:bg-gray-700 dark:text-white flex gap-2 px-2 items-center bg-gray-50 py-1.5  rounded-sm ">
                        <Clock2 className="w-4 h-4 text-green-700 dark:text-green-200" />
                        Shared at: {formatDate(visitorRoomInfo.joinedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">
                  Loading shared location...
                </p>
              )}
              <div className="flex  justify-between pt-4 gap-2 flex-wrap">
                <Button
                  variant="outline"
                  onClick={handleStopSharing}
                  disabled={!isSharing}
                >
                  <X className="h-4 w-4 mr-2" />
                  Stop Sharing Location with Host
                </Button>
                <Link href="/">
                  <Button>
                    <Home className="h-4 w-4 mr-2" />
                    Share Your Location
                  </Button>
                </Link>
              </div>
            </div>
            <div className="p-4 md:w-1/2">
              <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                Host Location
              </h2>
              <div className="h-[400px] md:h-[600px]">
                <GoogleMap
                  location={visitorRoomInfo.location}
                  position={visitorRoomInfo?.hostPosition || { lat: 0, lng: 0 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <PopupDialog
        title={"View Share Location"}
        description={
          "To view shared your location, please provide some information."
        }
      />
    </div>
  );
}
