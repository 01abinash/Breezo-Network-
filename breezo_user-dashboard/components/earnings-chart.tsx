"use client"

import { RefreshCw, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EarningsChart() {
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

      <div className="h-64 relative">
        {/* Chart bars */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between h-48 px-4">
          {Array.from({ length: 15 }).map((_, i) => {
            // Generate heights for the bars
            let height = "5%"
            if (i === 7) height = "100%"
            else if (i === 8) height = "60%"
            else if (i === 9) height = "30%"

            return <div key={i} className="w-4 bg-green-500 rounded-t" style={{ height }}></div>
          })}
        </div>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 pt-2 border-t">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="text-xs text-center w-8">
              <div>{18 + i > 31 ? i - 13 : 18 + i}</div>
              <div>{18 + i > 31 ? "Apr" : "Mar"}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4">
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
      </div>
    </div>
  )
}
