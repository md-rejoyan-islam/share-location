import LocationContext from "@/context/location-context";
import { useToast } from "@/hooks/use-toast";
import { Clipboard, Mail, Share2, SquareUserRound } from "lucide-react";
import { useContext } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

export default function ShareLocation({}) {
  const { socket, hostRooom, userInfo } = useContext(LocationContext);

  const { toast } = useToast();

  // handle share location
  const handleShareLocation = async () => {
    // create room
    if (socket?.connected && !hostRooom?.roomId) {
      socket.emit("createRoom", {
        position: userInfo.position,
        hostName: userInfo.name,
        hostEmail: userInfo.email,
      });
    }
  };

  // handle stop share location
  const handleStopShareLocation = () => {
    // remove room
    if (socket?.connected && hostRooom?.roomId) {
      socket.emit("removeRoom", {
        roomId: hostRooom?.roomId,
      });
    }
  };

  return (
    <div className="mb-6">
      <Label
        htmlFor="location"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        Share Location
      </Label>
      <div className="flex flex-col space-y-2">
        <p className="text-gray-600 dark:text-gray-40 dark:bg-gray-700 dark:text-white flex gap-2 px-2 items-center bg-gray-50 py-1.5  rounded-sm ">
          <SquareUserRound className="w-5 h-5 text-green-700 dark:text-green-200" />
          {userInfo.name}
        </p>
        <p className="text-gray-600 dark:text-gray-40 dark:bg-gray-700 dark:text-white flex gap-2 px-2 items-center bg-gray-50 py-1.5  rounded-sm ">
          <Mail className="w-5 h-5 text-green-700 dark:text-green-200" />
          {userInfo.email}
        </p>

        <div className="flex gap-2 flex-wrap-reverse pt-1.5">
          <Button
            variant="outline"
            className="flex-grow"
            onClick={() => {
              navigator?.clipboard?.writeText(
                window.location.href + "location/" + hostRooom?.roomId
              );
              toast({
                description: "URL copied to clipboard.",
              });
            }}
          >
            <Clipboard className="h-4 w-4 mr-2" />
            Copy Location URL
          </Button>
          {!hostRooom?.roomId ? (
            <Button
              className="flex-grow"
              onClick={handleShareLocation}
              disabled={hostRooom?.roomId ? true : false}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Location
            </Button>
          ) : (
            <Button
              className="flex-grow bg-red-500 text-white hover:bg-red-600"
              onClick={handleStopShareLocation}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Stop Location
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
