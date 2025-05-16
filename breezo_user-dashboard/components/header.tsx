"use client";

import Cookies from "js-cookie";
import { IoWalletOutline } from "react-icons/io5";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Share2, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { decryptJwtPayload } from "@/utils/getJwtBody";
import { getSolanaAddress } from "@/utils/getSolanaBody";
import * as fs from "fs";
import { Keypair } from "@solana/web3.js";

// const keypair = Keypair.fromSecretKey(secret);

// console.log("Public Key:", keypair.publicKey.toBase58());

export default function Header() {
  const { theme, setTheme } = useTheme();
  const cookie = Cookies.get("token");

  const decodeJwt = decryptJwtPayload(cookie);
  console.log("decodeJwt", decodeJwt);
  const email = decodeJwt?.UserInfo?.email;
  const wallet_address = decodeJwt?.UserInfo?.wallet_address;

  return (
    <header className="border-b bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <div className="text-xs text-gray-500">Pending Referrals: 0</div>
        </div>

        <div className="flex items-center gap-4">
          {wallet_address ? (
            <>
              <div
                onClick={async () => {
                  await getSolanaAddress();
                }}
                className="p-2 cursor-pointer flex text-xs bg-gray-200 rounded-2xl "
              >
                <IoWalletOutline strokeWidth={20} className="h-4 w-4 mr-2" />
                {wallet_address}
              </div>
            </>
          ) : (
            <Button
              onClick={async () => {
                await getSolanaAddress();
              }}
              className="bg-green-500 hover:bg-green-600 text-white rounded-full"
            >
              <IoWalletOutline strokeWidth={20} className="h-4 w-4 mr-2" />
              Connect Wallet
            </Button>
          )}

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
