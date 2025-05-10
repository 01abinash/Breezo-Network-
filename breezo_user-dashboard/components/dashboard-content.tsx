"use client";
import WelcomeBanner from "@/components/welcome-banner";
import EarningsSection from "@/components/earnings-section";
import EarningsChart from "@/components/earnings-chart";
import NetworksSection from "@/components/networks-section";
import ConnectionStatus from "@/components/connection-status";
import { useEffect, useState } from "react";
import { Axios } from "@/services/Axios";
import Cookies from "js-cookie";

export default function DashboardContent() {
  const cookie = Cookies.get("token");
  // @ts-ignore
  const decodeJwt = atob(cookie?.split(".")[1]);
  const userId = JSON.parse(decodeJwt)?.UserInfo?.id;
  const [userData, setUserData] = useState({});

  useEffect(() => {
    // console.log("hello");
    Axios.get(`/user/${userId}`).then((res) => {
      setUserData(res.data.data);
      // console.log("pending referrals", res.data);
    });
  }, []);
  console.log("userData", userData);

  return (
    <div className="space-y-6">
      <WelcomeBanner />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <EarningsSection userData={userData} />
        </div>
        <div>
          <ConnectionStatus />
        </div>
      </div>
      <EarningsChart />
      <NetworksSection />
    </div>
  );
}
