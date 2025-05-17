"use client";
import { DollarSign } from "lucide-react";
import { RiTailwindCssLine } from "react-icons/ri";
import { MdSwapHoriz } from "react-icons/md";
import { useEffect, useState } from "react";
import ConvertTokenModal from "./Modals/ConvertTokenModal";
import { getTokenAccounts, MINT_ADDRESS } from "@/utils/getSolanaBody";
// import { PublicKey } from "@solana/web3.js";
import Cookies from "js-cookie";
import { decryptJwtPayload } from "@/utils/getJwtBody";

export default function EarningsSection({ userData }: any) {
  const [convertModal, setConvertModal] = useState(false);
  const cookie = Cookies.get("token");
  const [tokenAccounts, setTokenAccounts] = useState<any[]>();

  const user_data = decryptJwtPayload(cookie);

  useEffect(() => {
    (async function () {
      console.log("token accs", user_data);

      const token_accounts = await getTokenAccounts(
        user_data?.UserInfo.wallet_address
      );
      setTokenAccounts(token_accounts);

      console.log("token 123123", token_accounts);
    })();
  }, []);

  console.log("userData", userData);

  const breezo_token = tokenAccounts?.find((a) => {
    return a.account.data.parsed.info.mint === MINT_ADDRESS;
  });
  console.log("breezo_token", breezo_token);

  // console.log("token", token);

  return (
    <>
      <div className="bg-white p-4 rounded-lg border">
        <h2 className="text-lg font-medium mb-4">Earnings</h2>

        <div className="flex gap-4 items-center">
          {/* <EarningsCard
          title="Total Earnings:"
          amount={userData.points || "N/A"}
          uptime="Uptime: 0 day, 21 hrs, 35 mins"
        /> */}

          <div className="border grow rounded-lg p-4">
            <div className="mb-2">
              <div className="font-medium">Total Earnings:</div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <div className="bg-green-500 rounded-full w-8 h-8 flex items-center justify-center text-white">
                <RiTailwindCssLine className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold">{userData.points}</div>
            </div>

            <div className="text-xs text-gray-500"></div>
          </div>

          <div
            onClick={() => {
              setConvertModal(true);
            }}
            className="cursor-pointer transition-colors hover:bg-gray-200 border border-gray-200 w-10 h-10 flex items-center justify-center rounded-xl"
          >
            <MdSwapHoriz className="" size={25} />
          </div>
          <div className="border rounded-lg p-4">
            <div className="mb-2">
              <div className="font-medium">
                Convert your points to Breezo Tokens
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <div className="bg-green-500 rounded-full w-8 h-8 flex items-center justify-center text-white">
                B
              </div>
              <div className="text-2xl font-bold">
                {/* {Math.floor(userData.points / 10)} */}
                {breezo_token?.account.data.parsed.info.tokenAmount.uiAmount}
              </div>
            </div>

            <div className="text-xs text-gray-500">
              Exchange Rate: 10 points = 1 Token
            </div>
          </div>
        </div>
      </div>
      <ConvertTokenModal
        open={convertModal}
        setOpen={setConvertModal}
        currentPoints={userData?.points || "N/A"}
        exchangeRate={10}
      />
    </>
  );
}

interface EarningsCardProps {
  title: string;
  amount: string;
  uptime: string;
}

function EarningsCard({ title, amount, uptime }: EarningsCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <div className="mb-2">
        <div className="font-medium">{title}</div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <div className="bg-green-500 rounded-full w-8 h-8 flex items-center justify-center text-white">
          <RiTailwindCssLine className="h-6 w-6" />
        </div>
        <div className="text-2xl font-bold">{amount}</div>
      </div>

      <div className="text-xs text-gray-500">{uptime}</div>
    </div>
  );
}
