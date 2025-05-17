"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { Axios } from "@/services/Axios";
import React, { useEffect, useState } from "react";
import { formatDistance } from "date-fns";
import { subDays } from "date-fns";
const pm25Breakpoints = [
  { lower: 0.0, upper: 12.0, aqiLow: 0, aqiHigh: 50 }, // Good: 0-12 µg/m³ -> AQI 0-50
  { lower: 12.1, upper: 35.4, aqiLow: 51, aqiHigh: 100 }, // Moderate: 12.1-35.4 µg/m³ -> AQI 51-100
  { lower: 35.5, upper: 55.4, aqiLow: 101, aqiHigh: 150 }, // Unhealthy for Sensitive Groups: 35.5-55.4 µg/m³ -> AQI 101-150
  { lower: 55.5, upper: 150.4, aqiLow: 151, aqiHigh: 200 }, // Unhealthy: 55.5-150.4 µg/m³ -> AQI 151-200
  { lower: 150.5, upper: 250.4, aqiLow: 201, aqiHigh: 300 }, // Very Unhealthy: 150.5-250.4 µg/m³ -> AQI 201-300
  { lower: 250.5, upper: 500.4, aqiLow: 301, aqiHigh: 500 }, // Hazardous: 250.5-500.4 µg/m³ -> AQI 301-500
];
function calculateAQI(pm25Concentration: number) {
  for (let i = 0; i < pm25Breakpoints.length; i++) {
    const { lower, upper, aqiLow, aqiHigh } = pm25Breakpoints[i];
    if (pm25Concentration >= lower && pm25Concentration <= upper) {
      // Apply the linear interpolation formula
      const aqi =
        ((aqiHigh - aqiLow) / (upper - lower)) * (pm25Concentration - lower) +
        aqiLow;
      return Math.round(aqi); // Round the result to the nearest integer
    }
  }
  return "Out of range"; // If PM2.5 concentration is out of expected range
}
// const aqiValue = calculateAQI(pm25Value);

export default function Page({ params }: { params: { mac_address: string } }) {
  const [aqi, setAqi] = useState<any[]>([]);

  console.log("params -- mac_address", params);

  useEffect(() => {
    Axios.get("/air/A4:CF:12:C5:A5:81").then((res) => {
      console.log("asdfasfd", res.data);

      setAqi(res.data.data);
    });
  }, []);

  return (
    <DashboardLayout>
      <div className="mx-10 my-5 bg-white border border-gray-200 p-5 rounded-sm  ">
        <div className="grid grid-cols-7 border-b border-black">
          <div> AQI </div>
          <div> PM2.5 </div>
          <div> CO2 </div>
          <div> Temperature </div>
          <div> Humidity </div>
          <div> Time </div>
          <div> Location </div>
        </div>
        <div>
          {aqi?.map((a: any) => {
            return (
              <div className="grid py-1 px-2 items-center grid-cols-7 border-b border-gray-300">
                <div>{calculateAQI(a.pm25)}</div>
                <div>{a.pm25}</div>
                <div>{a.co2_ppm}</div>
                <div>{a.temperature}</div>
                <div>{a?.humidity || "N/A"}</div>
                <div>
                  {a?.utc
                    ? formatDistance(new Date(a.utc), new Date(), {
                        addSuffix: true,
                      })
                    : "N/A"}
                </div>
                <div>{a.city}</div>
              </div>
              // <></>
            );
          })}
        </div>
      </div>{" "}
    </DashboardLayout>
  );
}
