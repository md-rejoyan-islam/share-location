import LocationContext from "@/context/location-context";
import { useToast } from "@/hooks/use-toast";
import { isEmail } from "@/lib/utils";
import { Clipboard, Share2 } from "lucide-react";
import { useContext, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function ShareLocation({}) {
  const {
    socket,
    setSocketStatus,
    hostRooom,
    userInfo: userInformation,
  } = useContext(LocationContext);

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
  });
  const { toast } = useToast();

  console.log(hostRooom);

  // handle share location
  const handleShareLocation = async () => {
    // test email field is not empty
    if (!userInfo.email)
      return toast({
        variant: "destructive",
        title: "Uh oh! Email is required!",
        description: "Please enter a email to share location",
      });

    // test email validation
    if (!isEmail(userInfo.email))
      return toast({
        variant: "destructive",
        title: "Uh oh! Invalid email!",
        description: "Please enter a valid email to share location",
      });

    // test name field is not empty
    if (!userInfo.name)
      return toast({
        variant: "destructive",
        title: "Uh oh! Name is required!",
        description: "Please enter a name to share location",
      });

    // create room
    if (socket?.connected && !hostRooom?.roomId) {
      socket.emit("createRoom", {
        position: userInformation.position,
        hostName: userInfo.name,
      });
    }
    // set socket status
    setSocketStatus("CONNECTING");
  };

  // handle stop share location
  const handleStopShareLocation = () => {
    // remove room
    if (socket?.connected && hostRooom?.roomId) {
      socket.emit("removeRoom", {
        roomId: hostRooom?.roomId,
      });
    }
    // set socket status
    setSocketStatus("DISCONNECTED");
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
        <Input
          type="text"
          id="location"
          placeholder="Enter a email to share location "
          value={userInfo.email}
          onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
        />
        <Input
          type="text"
          id="share-name"
          placeholder="Enter a name to share location "
          value={userInfo.name}
          onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
        />
        <div className="flex gap-2 flex-wrap-reverse">
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
