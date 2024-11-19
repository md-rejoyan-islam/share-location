import { useContext, useState } from "react";

import LocationContext from "@/context/location-context";
import { useToast } from "@/hooks/use-toast";
import { isEmail } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function PopupDialog({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const { userInfo, setUserInfo, socket } = useContext(LocationContext);

  const [inputs, setInputs] = useState<{
    name: string;
    email: string;
  }>({
    name: "",
    email: "",
  });

  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(true);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // name field is not empty
    if (!inputs.name)
      return toast({
        variant: "destructive",
        title: "Uh oh! Name is required!",
        description: "Please enter a name to share location",
      });

    // email field is not empty
    if (!inputs.email)
      return toast({
        variant: "destructive",
        title: "Uh oh! Email is required!",
        description: "Please enter a email to share location",
      });

    // test email
    if (!isEmail(inputs.email))
      return toast({
        variant: "destructive",
        title: "Uh oh! Invalid email!",
        description: "Please enter a valid email to share location",
      });

    setUserInfo({
      ...userInfo,
      name: inputs.name,
      email: inputs.email,
      userId: socket?.id || "",
    });
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={inputs.name}
              onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full py-3 h-fit">
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
