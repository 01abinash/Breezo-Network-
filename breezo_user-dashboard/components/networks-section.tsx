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
import { MdDeleteOutline } from "react-icons/md";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Axios } from "@/services/Axios";
import Cookies from "js-cookie";
import { decryptJwtPayload } from "@/utils/getJwtBody";
export default function NetworksSection() {
  const [open, setOpen] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const [userData, setUserData] = useState<any>({});
  const [devices, setDevices] = useState<any>([]);

  const cookie = Cookies.get("token");

  const decodeJwt = decryptJwtPayload(cookie);

  const userId = decodeJwt?.UserInfo?.id;
  console.log("userId", userId);

  useEffect(() => {
    (async function () {
      const res1 = await Axios.get(`/user/${userId}`);
      setUserData(res1.data.data);

      const res2 = await Axios.get("/user/devices");
      setDevices(res2.data.data);
    })();
  }, []);
  console.log("devices", devices);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await Axios.post(`/assign-sensor-to-user`, {
      sensorId: deviceId,
    });

    console.log("res", res);
  };
  return (
    <>
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium">Your Sensors</h2>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-sm">
                {/* <th className="py-2 px-4 text-left font-medium"></th> */}
                <th className="py-2 px-4 text-left font-medium">Device Id</th>
                {/* <th className="py-2 px-4 text-left font-medium">Location</th> */}
                <th className="py-2 px-4 text-left font-medium">
                  Successful transmission count
                </th>
                {/* <th className="py-2 px-4 text-left font-medium">
                  Device Connectivity Rate
                </th> */}
                <th className="py-2 px-4 text-left font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {/* {devices?.map((device) => {
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
              })} */}
              {devices &&
                devices?.map((device: any) => {
                  return (
                    <>
                      <tr className="h-16 my-2">
                        <td className="pl-4">{device?.mac_address}</td>
                        {/* <td className="pl-4">{device?.location || "N/A"}</td> */}
                        <td className="pl-4">
                          {device?.total_transmissions || 0}
                        </td>
                        {/* <td>{device?.mac_address}</td> */}
                        <td>
                          <div className="w-10 cursor-pointer h-10 bg-red-500 rounded flex items-center justify-center">
                            <MdDeleteOutline size={30} color="white" />
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
            onClick={async () => {
              setOpen(true);
            }}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            CONNECT SENSORS
          </Button>
          <p className="text-sm mt-2">
            Connect Breezo sensors on different locations to earn more.
          </p>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {/* <Button variant="outline">Edit Profile</Button> */}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter Device Id</DialogTitle>
            <DialogDescription>
              Enter the unique Id of the device below.
            </DialogDescription>
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
