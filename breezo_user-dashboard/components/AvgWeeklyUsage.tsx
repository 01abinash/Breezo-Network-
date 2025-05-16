"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
// import { Axios } from "@/services/client/Axios";
import { generateLastThreeMonthsChartData } from "@/utils/generateThreeMonthsChartData";
import { Axios } from "@/services/Axios";

const chartConfig = {
  views: {
    label: "Page Views",
  },
  desktop: {
    label: "Desktop",
    color: "#3b82f6",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function AvgWeeklyUsage({ logVol }: { logVol: any }) {
  // const chartData = generateLastThreeMonthsChartData() as any;
  // const [logVol, setLogVol] = React.useState(chartData);

  // console.log("logVol", logVol);
  // React.useEffect(() => {
  //   Axios.get("/resources/date/volume").then((res) => {
  //     console.log("vol", res.data.data);
  //     const fetchedLogs = res.data.data;

  //     const newChartData = chartData.map((item: any) => {
  //       const newLog = fetchedLogs?.find((log: any) => item.date === log?.date);

  //       if (newLog) {
  //         return {
  //           ...newLog,
  //         };
  //       }
  //       return {
  //         ...item,
  //       };
  //     });
  //     console.log("newChartData", newChartData);
  //     setLogVol(newChartData);
  //   });
  // }, []);

  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("desktop");

  // const total = React.useMemo(
  //   () => ({
  //     desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0),
  //     mobile: chartData.reduce((acc, curr) => acc + curr.mobile, 0),
  //   }),
  //   []
  // );

  return (
    <div className="mt-8">
      <Card>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={logVol}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="views"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                  />
                }
              />
              <Bar
                dataKey={"entry_count"}
                fill={`var(--color-${activeChart})`}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

/* <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <CardTitle>Bar Chart - Volume of Logs</CardTitle>
            <CardDescription>
              Showing number of logs of all devices each day for the last 3
              months
            </CardDescription>
          </div>
          <div className="flex">
            {["total_entry", "mobile"].map((key) => {
              const chart = key as keyof typeof chartConfig;
              return (
                <button
                  key={chart}
                  data-active={activeChart === chart}
                  className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                  onClick={() => setActiveChart(chart)}
                >
                  <span className="text-xs text-muted-foreground">
                  </span>
                  <span className="text-lg font-bold leading-none sm:text-3xl">
                  </span>
                </button>
              );
            })}
          </div>
        </CardHeader>
        */
