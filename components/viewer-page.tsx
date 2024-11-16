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
import { Home, MapPin, Share2, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface SharedUser {
  name: string;
  location: string;
  shareName: string;
  sharedAt: string;
}

const sharedUser: SharedUser = {
  name: "Alice",
  location: "Los Angeles, CA 90001, USA",
  shareName: "Work",
  sharedAt: new Date().toISOString(),
};

// Simulated Google Maps API
const GoogleMap = ({ location }: { location: string }) => (
  <div className="w-full h-full bg-gray-300 dark:bg-gray-700 rounded-lg overflow-hidden relative">
    <div className="absolute inset-0 flex items-center justify-center">
      <MapPin className="h-8 w-8 text-red-500" />
    </div>
    <div className="absolute bottom-4 left-4 right-4 bg-white dark:bg-gray-800 p-2 rounded shadow">
      <p className="text-sm text-gray-600 dark:text-gray-300">{location}</p>
    </div>
  </div>
);

export function ViewerPageComponent() {
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(true);
  const [viewerName, setViewerName] = useState("");
  const [isShareOptionOpen, setIsShareOptionOpen] = useState(false);
  const [sharedLocation, setSharedLocation] = useState<SharedUser | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [wantSharedLocation, setWantSharedLocation] = useState(false);

  useEffect(() => {
    // Simulate fetching shared location
    setTimeout(() => {
      setSharedLocation(sharedUser);
    }, 2000);
  }, []);

  const handleNameSubmit = (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (viewerName) {
      setIsNameDialogOpen(false);
      setIsShareOptionOpen(true);
    }
  };

  const handleShareOption = (share: boolean) => {
    setIsShareOptionOpen(false);
    setIsSharing(share);
    if (share) {
      console.log(`${viewerName} agreed to share their location`);
      // Here you would typically send this information to your backend
    }
    if (wantSharedLocation) {
      console.log(`${viewerName} wants to receive shared location`);
      // Here you would typically request the shared location from your backend
    }
  };

  const handleStopSharing = () => {
    setIsSharing(false);
    console.log(`${viewerName} stopped sharing their location`);
    // Here you would typically send this information to your backend
  };

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
                {sharedLocation ? (
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold">
                        {sharedLocation.name}&apos;s {sharedLocation.shareName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {sharedLocation.location}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Shared at:{" "}
                        {new Date(sharedLocation.sharedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="h-[300px]">
                      <GoogleMap location={sharedLocation.location} />
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
        <DialogContent>
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
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isShareOptionOpen} onOpenChange={setIsShareOptionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Your Location</DialogTitle>
            <DialogDescription>
              Do you want to share your location with this user?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleShareOption(false)}>
              No
            </Button>
            <Button onClick={() => handleShareOption(true)}>
              <Share2 className="h-4 w-4 mr-2" />
              Yes, Share My Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
