import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { MdSwapHoriz } from "react-icons/md";
import { Axios } from "@/services/Axios";

export default function ConvertTokenModal({
  open,
  setOpen,
  exchangeRate,
  currentPoints,
}: {}) {
  const [swapVal, setSwapVal] = useState<number | undefined>();

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Convert Points to Tokens</DialogTitle>
            <DialogDescription>
              Your Points: {currentPoints || "N/A"}
              <br />
              Exchange Rate: {exchangeRate || "N/A"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={() => {}} className="grid gap-4 py-4">
            <div className="flex items-end gap-4">
              <div>
                <label htmlFor="name" className="text-right">
                  Point
                </label>
                <Input
                  id="swapValue"
                  type="number"
                  value={swapVal || ""}
                  onChange={(e) => {
                    const number = Number(e.target.value);
                    if (!Number.isFinite(number)) return;
                    if (number > currentPoints) {
                      setSwapVal(currentPoints);
                      return;
                    }
                    console.log("setSwapVal");

                    setSwapVal(number);
                  }}
                  className="col-span-3 w-full"
                />
              </div>

              <div
                onClick={async () => {
                  await Axios.post(`/token-convert`, {
                    points: swapVal,
                  });
                }}
                className="cursor-pointer transition-colors hover:bg-gray-200 border border-gray-200 min-w-10 h-10 flex items-center justify-center rounded-xl"
                title="Swap Now"
              >
                <MdSwapHoriz className="" size={25} />
              </div>
              <div>
                <label htmlFor="name" className="text-right">
                  Tokens
                </label>
                <Input
                  id="name"
                  value={swapVal ? Math.floor(swapVal / exchangeRate) : ""}
                  onChange={(e) => {}}
                  className="col-span-3 w-full"
                />
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>{" "}
    </>
  );
}
