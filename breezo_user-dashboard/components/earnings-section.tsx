import { DollarSign } from "lucide-react";
import { RiTailwindCssLine } from "react-icons/ri";

export default function EarningsSection({ userData }: any) {
  return (
    <div className="bg-white p-4 rounded-lg border">
      <h2 className="text-lg font-medium mb-4">Earnings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EarningsCard
          title="Total Earnings:"
          amount={userData.points || "N/A"}
          uptime="Uptime: 0 day, 21 hrs, 35 mins"
        />

        <EarningsCard
          title="Today's Earnings:"
          amount={userData.points || "N/A"}
          uptime="Uptime: 0 day, 0 hr, 0 min"
        />
      </div>
    </div>
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
