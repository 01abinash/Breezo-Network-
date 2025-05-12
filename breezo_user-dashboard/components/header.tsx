"use client";

import Cookies from "js-cookie";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Share2, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { decryptJwtPayload } from "@/utils/getJwtBody";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const cookie = Cookies.get("token");

  const decodeJwt = decryptJwtPayload(cookie);
  console.log("decodeJwt", decodeJwt);
  const email = decodeJwt?.UserInfo?.email;
  // console.log("cookie", JSON.parse(decodeJwt).UserInfo.email);

  return (
    <header className="border-b bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <div className="text-xs text-gray-500">Pending Referrals: 0</div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
            <Users className="h-4 w-4" />
            <span className="text-sm">Referrals: 0</span>
          </div>

          <Button className="bg-green-500 hover:bg-green-600 text-white rounded-full">
            <Share2 className="h-4 w-4 mr-2" />
            SHARE WITH FRIENDS
          </Button>

          <div className="flex items-center gap-2">
            <span>Hello, {email || ""}!</span>
            <Avatar>
              <AvatarImage src="/avatar.png" />
              <AvatarFallback>SM</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
