"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import LocationContext from "@/context/location-context";
import { formatDate } from "@/lib/utils";
import { Clock2, Home, Mail, MapPin, SquareUserRound, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import GoogleMap from "../google-map";

export function SharedLocationPage() {
  const { roomId } = useParams();

  const { socket, connectSocket, visitorRoomInfo } =
    useContext(LocationContext);

  const [isNameDialogOpen, setIsNameDialogOpen] = useState(true);
  const [wantSharedLocation, setWantSharedLocation] = useState(false);
  const [viewerName, setViewerName] = useState("");
  const [isSharing, setIsSharing] = useState(false);

  // connect to the socket
  useEffect(() => {
    connectSocket();
    return () => {
      if (socket?.connected) {
        socket.disconnect();
      }
    };
  }, []);

  const handleNameSubmit = (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIsNameDialogOpen(false);

    // connectSocket();
    if (socket?.connected) {
      socket.emit("joinRoom", {
        roomId,
        userName: viewerName,
        wantSharedLocation,
        position: visitorRoomInfo.position,
      });
    }
  };

  const handleStopSharing = () => {
    setIsSharing(false);
    console.log(`${viewerName} stopped sharing their location`);
    // Here you would typically send this information to your backend
  };

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
                      {" "}
                      <p className="text-gray-500 dark:text-gray-40 dark:bg-gray-700 dark:text-white flex gap-2 px-2 items-center bg-gray-50 py-1.5  rounded-sm ">
                        <SquareUserRound className="w-4 h-4 text-green-700 dark:text-green-200" />
                        {visitorRoomInfo.hostName}
                      </p>
                      <p className="text-gray-500 dark:text-gray-40 dark:bg-gray-700 dark:text-white flex gap-2 px-2 items-center bg-gray-50 py-1.5  rounded-sm ">
                        <Mail className="w-4 h-4 text-green-700 dark:text-green-200" />
                        rejoyanislam0014@gmail.com
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
                  position={visitorRoomInfo?.position || { lat: 0, lng: 0 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen flex flex-col `}>
      <div className="flex-1 p-4 bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-4">
            <Card>
              <CardHeader>
                <CardTitle>Shared Location</CardTitle>
                <CardDescription>
                  View the location shared with you
                </CardDescription>
              </CardHeader>
              <CardContent>
                {visitorRoomInfo.roomId ? (
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold">
                        {visitorRoomInfo.hostName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {visitorRoomInfo.location}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Shared at: {formatDate(visitorRoomInfo.joinedAt)}
                      </p>
                    </div>
                    <div className="h-[300px]">
                      <GoogleMap
                        location={visitorRoomInfo.location}
                        position={
                          visitorRoomInfo?.position || { lat: 0, lng: 0 }
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-center py-4 text-gray-500 dark:text-gray-400">
                    Loading shared location...
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handleStopSharing}
                  disabled={!isSharing}
                >
                  <X className="h-4 w-4 mr-2" />
                  Stop Sharing Location
                </Button>
                <Link href="/">
                  <Button>
                    <Home className="h-4 w-4 mr-2" />
                    Go to Home
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={isNameDialogOpen} onOpenChange={setIsNameDialogOpen}>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>Enter Your Name</DialogTitle>
            <DialogDescription>
              Please enter your name to view the shared location.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleNameSubmit}>
            <Input
              value={viewerName}
              onChange={(e) => setViewerName(e.target.value)}
              placeholder="Your name"
              className="mb-4"
            />
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="wantSharedLocation"
                checked={wantSharedLocation}
                onCheckedChange={(checked) =>
                  setWantSharedLocation(checked === true)
                }
              />
              <label
                htmlFor="wantSharedLocation"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Do you want shared location with her?
              </label>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={!viewerName}>
                Submit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
