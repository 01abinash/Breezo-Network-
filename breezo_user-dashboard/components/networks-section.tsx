"use client";

import { Button } from "@/components/ui/button";
import { WifiOff, Edit2, DollarSign, WifiIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Axios } from "@/services/Axios";
import Cookies from "js-cookie";
export default function NetworksSection() {
  const [open, setOpen] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const [userData, setUserData] = useState<any>({});

  const cookie = Cookies.get("token");

  const decodeJwt = atob(cookie?.split(".")[1]);

  const userId = JSON.parse(decodeJwt)?.UserInfo?.id;
  console.log("userId", userId);

  useEffect(() => {
    Axios.get(`/user/${userId}`).then((res) => {
      setUserData(res.data.data);
    });
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    Axios.put(`/update-user-devices/${userId}`, {
      deviceId,
    });
  };

  return (
    <>
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium">Your Devices</h2>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-sm">
                <th className="py-2 px-4 text-left font-medium"></th>
                <th className="py-2 px-4 text-left font-medium">Device Id</th>
                <th className="py-2 px-4 text-left font-medium">Local IP</th>
                <th className="py-2 px-4 text-left font-medium">
                  Time Connected
                </th>
                <th className="py-2 px-4 text-left font-medium">
                  Device Connectivity Rate
                </th>
                <th className="py-2 px-4 text-left font-medium">
                  Points Earned
                </th>
              </tr>
            </thead>
            <tbody>
              {userData?.device_ids?.map((device) => {
                return (
                  <>
                    <tr className="border-t">
                      <td className="py-3 px-4">
                        <WifiIcon className="h-4 w-4 text-red-500" />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <span>{device}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-red-500">43.231.210.77</td>
                      <td className="py-3 px-4">0 day, 21 hrs, 39 mins</td>
                      <td className="py-3 px-4">75%</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-between bg-gray-100 rounded-lg px-3 py-1">
                          <div className="flex items-center">
                            <div className="bg-green-500 rounded-full w-4 h-4 flex items-center justify-center text-white mr-1">
                              <DollarSign className="h-3 w-3" />
                            </div>
                            <span>N/A</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <Button
            onClick={() => {
              setOpen(true);
            }}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            ADD DEVICE
          </Button>
          <p className="text-sm mt-2">
            Connect devices on different locations to earn more.
          </p>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {/* <Button variant="outline">Edit Profile</Button> */}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            {/* <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription> */}
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                DeviceId
              </Label>
              <Input
                id="name"
                value={deviceId}
                onChange={(e) => {
                  setDeviceId(e.target.value);
                }}
                className="col-span-3"
              />
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
