"use client";

import { RefreshCw, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Axios } from "@/services/Axios";
import { generateLastThreeMonthsChartData } from "@/utils/generateThreeMonthsChartData";
import { AvgWeeklyUsage } from "./AvgWeeklyUsage";
export default function EarningsChart() {
  const lastThreeInit = generateLastThreeMonthsChartData();
  console.log("lastThreeInit", lastThreeInit);

  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    Axios.get("/earning-statistics").then((res) => {
      const apiData = res.data.data;

      console.log("apiData", apiData);

      const integrate = lastThreeInit?.map((item: any) => {
        // const existingData = apiData?.find((it: any) => it._id === item.date);
        const isData = apiData?.find((it: any) => it._id === item.date);

        console.log("isData", isData);
        console.log("res.data", res.data.data);

        if (isData !== -1 && isData) {
          return { date: isData._id, entry_count: isData.count };
        } else {
          return { date: item.date, entry_count: item.entry_count };
        }
      });

      setChartData(integrate);
    });
  }, []);

  console.log("chartData", chartData);

  return (
    <div className="bg-white p-4 rounded-lg border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5" />
          <h2 className="font-medium">Earnings Statistics</h2>
        </div>

        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <AvgWeeklyUsage logVol={chartData} />

      {/* <div className="flex items-center gap-4 mt-4">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-xs">Network Earnings</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          <span className="text-xs">Referrals</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-700"></div>
          <span className="text-xs">Peak Achievements</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className="text-xs">Referral Bonus</span>
        </div>
      </div> */}
    </div>
  );
}
